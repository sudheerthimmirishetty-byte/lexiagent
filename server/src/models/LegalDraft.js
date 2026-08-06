const mongoose = require('mongoose');

const legalDraftSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    draftType: {
      type: String,
      required: true,
      enum: [
        'Legal Notice',
        'Complaint',
        'Rental Agreement',
        'Employment Agreement',
        'NDA',
        'Affidavit',
        'Contract',
        'Power of Attorney',
        'Service Agreement',
        'Freelancer Agreement',
        'Privacy Policy',
        'Terms & Conditions',
        'Other',
      ],
    },
    title: {
      type: String,
      required: true,
    },
    prompt: {
      type: String,
      required: true,
    },
    generatedDraft: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'finalized', 'archived'],
      default: 'draft',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('LegalDraft', legalDraftSchema);
