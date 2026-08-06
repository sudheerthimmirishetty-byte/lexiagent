const mongoose = require('mongoose');
const DashboardAnalytics = require('../models/DashboardAnalytics');
const Document = require('../models/Document');
const Conversation = require('../models/Conversation');
const LegalDraft = require('../models/LegalDraft');
const ActivityLog = require('../models/ActivityLog');
const { getMemoryLogs, getMemoryAnalytics } = require('../utils/activityLogger');

const isDbConnected = () => mongoose.connection.readyState === 1;

const getDashboardOverview = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const uidStr = String(userId);

    let stats = {
      documentsUploaded: 0,
      documentsAnalyzed: 0,
      draftsGenerated: 0,
      chatSessions: 0,
      totalMessages: 0,
    };

    let recentDocuments = [];
    let recentChats = [];
    let recentDrafts = [];
    let recentActivities = [];

    if (isDbConnected()) {
      try {
        const dbStats = await DashboardAnalytics.findOne({ userId }).lean();
        if (dbStats) stats = dbStats;

        recentDocuments = await Document.find({ userId }).sort({ createdAt: -1 }).limit(5).lean();
        recentChats = await Conversation.find({ userId }).sort({ updatedAt: -1 }).limit(5).lean();
        recentDrafts = await LegalDraft.find({ userId }).sort({ createdAt: -1 }).limit(5).lean();
        recentActivities = await ActivityLog.find({ userId }).sort({ createdAt: -1 }).limit(10).lean();
      } catch (e) {}
    }

    // Merge memory stats and logs if DB returns empty or when offline
    const memStats = getMemoryAnalytics(uidStr);
    if (memStats) {
      stats.documentsUploaded = Math.max(stats.documentsUploaded, memStats.documentsUploaded);
      stats.documentsAnalyzed = Math.max(stats.documentsAnalyzed, memStats.documentsAnalyzed);
      stats.draftsGenerated = Math.max(stats.draftsGenerated, memStats.draftsGenerated);
      stats.chatSessions = Math.max(stats.chatSessions, memStats.totalMessages);
      stats.totalMessages = Math.max(stats.totalMessages, memStats.totalMessages);
    }

    const memLogs = getMemoryLogs(uidStr);
    if (recentActivities.length === 0 && memLogs.length > 0) {
      recentActivities = memLogs.slice(0, 10);
    }

    res.json({
      success: true,
      stats,
      recentDocuments,
      recentChats,
      recentDrafts,
      recentActivities,
    });
  } catch (err) {
    next(err);
  }
};

const getStatsOnly = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const uidStr = String(userId);
    let stats = { documentsUploaded: 0, documentsAnalyzed: 0, draftsGenerated: 0, chatSessions: 0, totalMessages: 0 };

    if (isDbConnected()) {
      try {
        const dbStats = await DashboardAnalytics.findOne({ userId }).lean();
        if (dbStats) stats = dbStats;
      } catch (e) {}
    }

    const memStats = getMemoryAnalytics(uidStr);
    if (memStats) {
      stats.documentsUploaded = Math.max(stats.documentsUploaded, memStats.documentsUploaded);
      stats.documentsAnalyzed = Math.max(stats.documentsAnalyzed, memStats.documentsAnalyzed);
      stats.draftsGenerated = Math.max(stats.draftsGenerated, memStats.draftsGenerated);
      stats.chatSessions = Math.max(stats.chatSessions, memStats.totalMessages);
      stats.totalMessages = Math.max(stats.totalMessages, memStats.totalMessages);
    }

    res.json({ success: true, stats });
  } catch (err) {
    next(err);
  }
};

const getRecentActivities = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const uidStr = String(userId);
    let recentActivities = [];

    if (isDbConnected()) {
      try {
        recentActivities = await ActivityLog.find({ userId }).sort({ createdAt: -1 }).limit(20).lean();
      } catch (e) {}
    }

    if (recentActivities.length === 0) {
      recentActivities = getMemoryLogs(uidStr).slice(0, 20);
    }

    res.json({ success: true, recentActivities });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDashboardOverview,
  getStatsOnly,
  getRecentActivities,
};
