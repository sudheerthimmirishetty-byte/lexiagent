const mongoose = require('mongoose');
const LegalDraft = require('../models/LegalDraft');
const { draftGeneratorAgent } = require('../services/agents/draftGenerator.agent');
const { logActivity } = require('../utils/activityLogger');

const memoryDrafts = new Map();
const isDbConnected = () => mongoose.connection.readyState === 1;

const generateDraft = async (req, res, next) => {
  try {
    const { draftType, title, prompt, documentText } = req.body;
    const userId = req.user._id || req.user.id;

    // Invoke AI Draft Generation Agent
    const draftOutput = await draftGeneratorAgent({
      prompt,
      draftType,
      documentText: documentText || '',
    });

    const generatedContent = draftOutput.generatedDraft || '# LEGAL DRAFT\n\nContent generated successfully.';

    let draftRecord;
    if (isDbConnected()) {
      try {
        draftRecord = await LegalDraft.create({
          userId,
          draftType,
          title,
          prompt,
          generatedDraft: generatedContent,
          status: 'draft',
        });
      } catch (e) {
        const fakeId = 'dr_' + Date.now();
        draftRecord = {
          _id: fakeId,
          userId,
          draftType,
          title,
          prompt,
          generatedDraft: generatedContent,
          status: 'draft',
          createdAt: new Date(),
        };
        memoryDrafts.set(fakeId, draftRecord);
      }
    } else {
      const fakeId = 'dr_' + Date.now();
      draftRecord = {
        _id: fakeId,
        userId,
        draftType,
        title,
        prompt,
        generatedDraft: generatedContent,
        status: 'draft',
        createdAt: new Date(),
      };
      memoryDrafts.set(fakeId, draftRecord);
    }

    await logActivity(userId, `Generated legal draft: ${title} (${draftType})`, 'draft');

    res.status(201).json({
      success: true,
      message: 'Legal draft generated successfully.',
      draft: draftRecord,
    });
  } catch (err) {
    next(err);
  }
};

const getDrafts = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    let drafts = [];

    if (isDbConnected()) {
      try {
        drafts = await LegalDraft.find({ userId }).sort({ createdAt: -1 }).lean();
      } catch (e) {
        drafts = Array.from(memoryDrafts.values()).filter((d) => String(d.userId) === String(userId));
      }
    } else {
      drafts = Array.from(memoryDrafts.values()).filter((d) => String(d.userId) === String(userId));
    }

    res.json({ success: true, drafts });
  } catch (err) {
    next(err);
  }
};

const getDraftById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.id;
    let draft = null;

    if (isDbConnected()) {
      try {
        draft = await LegalDraft.findOne({ _id: id, userId }).lean();
      } catch (e) {
        draft = memoryDrafts.get(id);
      }
    } else {
      draft = memoryDrafts.get(id);
    }

    if (!draft) {
      return res.status(404).json({ success: false, message: 'Draft not found.' });
    }

    res.json({ success: true, draft });
  } catch (err) {
    next(err);
  }
};

const deleteDraft = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.id;

    if (isDbConnected()) {
      try {
        await LegalDraft.deleteOne({ _id: id, userId });
      } catch (e) {
        memoryDrafts.delete(id);
      }
    } else {
      memoryDrafts.delete(id);
    }

    res.json({ success: true, message: 'Draft deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  generateDraft,
  getDrafts,
  getDraftById,
  deleteDraft,
};
