const mongoose = require('mongoose');

const dashboardAnalyticsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    documentsUploaded: {
      type: Number,
      default: 0,
    },
    documentsAnalyzed: {
      type: Number,
      default: 0,
    },
    draftsGenerated: {
      type: Number,
      default: 0,
    },
    chatSessions: {
      type: Number,
      default: 0,
    },
    totalMessages: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('DashboardAnalytics', dashboardAnalyticsSchema);
