const mongoose = require('mongoose');

const documentAnalysisSchema = new mongoose.Schema(
  {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    documentCategory: {
      type: String,
      default: 'General Legal Document',
    },
    summary: {
      type: String,
      default: '',
    },
    importantClauses: [
      {
        title: String,
        originalClause: String,
        simpleExplanation: String,
        importance: String,
        riskLevel: String,
      },
    ],
    riskyClauses: [
      {
        riskType: String,
        severity: {
          type: String,
          enum: ['Low', 'Medium', 'High', 'Critical'],
          default: 'Medium',
        },
        description: String,
        recommendation: String,
      },
    ],
    recommendedActions: [
      {
        action: String,
        reason: String,
        priority: String,
      },
    ],
    missingClauses: [String],
    deadlines: [String],
    penalties: [String],
    confidenceScore: {
      type: Number,
      default: 0.95,
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('DocumentAnalysis', documentAnalysisSchema);
