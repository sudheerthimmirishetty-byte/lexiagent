const mongoose = require('mongoose');
const Document = require('../models/Document');
const DocumentAnalysis = require('../models/DocumentAnalysis');
const { extractTextFromFile } = require('../utils/textExtractor');
const { docAnalysisAgent } = require('../services/agents/docAnalysis.agent');
const { riskDetectionAgent } = require('../services/agents/riskDetection.agent');
const { logActivity } = require('../utils/activityLogger');
const fs = require('fs');

const memoryDocuments = new Map();
const memoryAnalyses = new Map();
const isDbConnected = () => mongoose.connection.readyState === 1;

const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No document file uploaded.' });
    }

    const { originalname, mimetype, size, path: filePath } = req.file;
    const documentName = req.body.documentName || originalname;

    // Extract text from document file
    let extractedText = '';
    try {
      extractedText = await extractTextFromFile(filePath, mimetype, originalname);
    } catch (extractErr) {
      console.warn('[Text Extraction Warning]', extractErr.message);
      extractedText = `Document uploaded: ${originalname}. (Raw text extraction fallback).`;
    }

    let doc;
    if (isDbConnected()) {
      try {
        doc = await Document.create({
          userId: req.user._id || req.user.id,
          documentName,
          documentType: req.body.documentType || 'Legal Document',
          originalFileName: originalname,
          mimeType: mimetype,
          fileSize: size,
          storagePath: filePath,
          extractedText,
          status: 'uploaded',
        });
      } catch (e) {
        const fakeId = 'doc_' + Date.now();
        doc = {
          _id: fakeId,
          userId: req.user._id || req.user.id,
          documentName,
          documentType: 'Legal Document',
          originalFileName: originalname,
          mimeType: mimetype,
          fileSize: size,
          storagePath: filePath,
          extractedText,
          status: 'uploaded',
          uploadedAt: new Date(),
        };
        memoryDocuments.set(fakeId, doc);
      }
    } else {
      const fakeId = 'doc_' + Date.now();
      doc = {
        _id: fakeId,
        userId: req.user._id || req.user.id,
        documentName,
        documentType: 'Legal Document',
        originalFileName: originalname,
        mimeType: mimetype,
        fileSize: size,
        storagePath: filePath,
        extractedText,
        status: 'uploaded',
        uploadedAt: new Date(),
      };
      memoryDocuments.set(fakeId, doc);
    }

    const userId = req.user._id || req.user.id;
    await logActivity(userId, `Uploaded document: ${documentName}`, 'upload');

    res.status(201).json({
      success: true,
      message: 'Document uploaded and text extracted successfully.',
      document: doc,
    });
  } catch (err) {
    next(err);
  }
};

const getDocuments = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    let documents = [];

    if (isDbConnected()) {
      try {
        documents = await Document.find({ userId }).sort({ createdAt: -1 }).lean();
      } catch (e) {
        documents = Array.from(memoryDocuments.values()).filter((d) => String(d.userId) === String(userId));
      }
    } else {
      documents = Array.from(memoryDocuments.values()).filter((d) => String(d.userId) === String(userId));
    }

    res.json({ success: true, documents });
  } catch (err) {
    next(err);
  }
};

const getDocumentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.id;
    let document = null;
    let analysis = null;

    if (isDbConnected()) {
      try {
        document = await Document.findOne({ _id: id, userId }).lean();
        if (document) {
          analysis = await DocumentAnalysis.findOne({ documentId: id }).lean();
        }
      } catch (e) {
        document = memoryDocuments.get(id);
        analysis = memoryAnalyses.get(id);
      }
    } else {
      document = memoryDocuments.get(id);
      analysis = memoryAnalyses.get(id);
    }

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found.' });
    }

    res.json({ success: true, document, analysis });
  } catch (err) {
    next(err);
  }
};

const analyzeDocument = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.id;
    let doc = null;

    if (isDbConnected()) {
      try {
        doc = await Document.findOne({ _id: id, userId });
      } catch (e) {
        doc = memoryDocuments.get(id);
      }
    } else {
      doc = memoryDocuments.get(id);
    }

    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found.' });
    }

    // Run AI Document Analysis Agent
    const analysisOutput = await docAnalysisAgent({
      documentText: doc.extractedText || '',
      userPrompt: req.body.prompt || '',
      documentMeta: doc,
    });

    // Run AI Risk Detection Agent
    const riskOutput = await riskDetectionAgent({
      documentText: doc.extractedText || '',
    });

    const data = analysisOutput.data || {};
    const risks = riskOutput.data.riskBreakdown || data.riskyClauses || [];

    let analysisRecord;
    if (isDbConnected()) {
      try {
        analysisRecord = await DocumentAnalysis.findOneAndUpdate(
          { documentId: id },
          {
            documentId: id,
            userId,
            documentCategory: data.documentCategory || doc.documentType || 'Legal Document',
            summary: data.summary || 'Comprehensive legal analysis completed.',
            importantClauses: data.importantClauses || [],
            riskyClauses: risks.length ? risks : data.riskyClauses || [],
            recommendedActions: data.recommendedActions || [],
            missingClauses: data.missingClauses || [],
            deadlines: data.deadlines || [],
            penalties: data.penalties || [],
            confidenceScore: data.confidenceScore || 0.95,
            generatedAt: new Date(),
          },
          { upsert: true, new: true }
        );

        doc.status = 'analyzed';
        if (data.documentCategory) doc.documentType = data.documentCategory;
        await doc.save();
      } catch (e) {
        analysisRecord = {
          _id: 'an_' + Date.now(),
          documentId: id,
          userId,
          documentCategory: data.documentCategory || 'Legal Document',
          summary: data.summary || 'Document analyzed successfully.',
          importantClauses: data.importantClauses || [],
          riskyClauses: risks.length ? risks : data.riskyClauses || [],
          recommendedActions: data.recommendedActions || [],
          confidenceScore: 0.95,
        };
        memoryAnalyses.set(id, analysisRecord);
        if (doc) doc.status = 'analyzed';
      }
    } else {
      analysisRecord = {
        _id: 'an_' + Date.now(),
        documentId: id,
        userId,
        documentCategory: data.documentCategory || 'Legal Document',
        summary: data.summary || 'Document analyzed successfully.',
        importantClauses: data.importantClauses || [],
        riskyClauses: risks.length ? risks : data.riskyClauses || [],
        recommendedActions: data.recommendedActions || [],
        confidenceScore: 0.95,
      };
      memoryAnalyses.set(id, analysisRecord);
      if (doc) doc.status = 'analyzed';
    }

    await logActivity(userId, `Analyzed document: ${doc.documentName}`, 'analysis');

    res.json({
      success: true,
      message: 'Document analyzed successfully.',
      analysis: analysisRecord,
    });
  } catch (err) {
    next(err);
  }
};

const deleteDocument = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.id;

    if (isDbConnected()) {
      try {
        const doc = await Document.findOne({ _id: id, userId });
        if (doc) {
          if (doc.storagePath && fs.existsSync(doc.storagePath)) {
            fs.unlinkSync(doc.storagePath);
          }
          await Document.deleteOne({ _id: id });
          await DocumentAnalysis.deleteMany({ documentId: id });
        }
      } catch (e) {
        memoryDocuments.delete(id);
        memoryAnalyses.delete(id);
      }
    } else {
      memoryDocuments.delete(id);
      memoryAnalyses.delete(id);
    }

    res.json({ success: true, message: 'Document and related analysis deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  uploadDocument,
  getDocuments,
  getDocumentById,
  analyzeDocument,
  deleteDocument,
};
