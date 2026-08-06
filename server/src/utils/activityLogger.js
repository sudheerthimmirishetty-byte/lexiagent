const mongoose = require('mongoose');
const ActivityLog = require('../models/ActivityLog');
const DashboardAnalytics = require('../models/DashboardAnalytics');

const memoryActivityLogs = new Map(); // key: userId, value: array of activities
const memoryAnalytics = new Map(); // key: userId, value: analytics object

const isDbConnected = () => mongoose.connection.readyState === 1;

const logActivity = async (userId, activity, activityType, metadata = {}) => {
  try {
    if (!userId) return;
    const uidStr = String(userId);

    if (isDbConnected() && mongoose.Types.ObjectId.isValid(userId)) {
      try {
        await ActivityLog.create({
          userId,
          activity,
          activityType,
          metadata,
        });

        let analytics = await DashboardAnalytics.findOne({ userId });
        if (!analytics) {
          analytics = await DashboardAnalytics.create({ userId });
        }

        if (activityType === 'upload') analytics.documentsUploaded += 1;
        if (activityType === 'analysis') analytics.documentsAnalyzed += 1;
        if (activityType === 'draft') analytics.draftsGenerated += 1;
        if (activityType === 'chat') analytics.totalMessages += 1;

        await analytics.save();
      } catch (e) {}
    }

    // Always record to in-memory store for fallback
    let userLogs = memoryActivityLogs.get(uidStr) || [];
    userLogs.unshift({
      _id: 'act_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      userId: uidStr,
      activity,
      activityType,
      metadata,
      createdAt: new Date(),
    });
    memoryActivityLogs.set(uidStr, userLogs);

    let userStats = memoryAnalytics.get(uidStr) || {
      documentsUploaded: 0,
      documentsAnalyzed: 0,
      draftsGenerated: 0,
      chatSessions: 0,
      totalMessages: 0,
    };

    if (activityType === 'upload') userStats.documentsUploaded += 1;
    if (activityType === 'analysis') userStats.documentsAnalyzed += 1;
    if (activityType === 'draft') userStats.draftsGenerated += 1;
    if (activityType === 'chat') userStats.totalMessages += 1;

    memoryAnalytics.set(uidStr, userStats);
  } catch (err) {
    console.warn('[ActivityLogger Warning]', err.message);
  }
};

const getMemoryLogs = (userId) => {
  return memoryActivityLogs.get(String(userId)) || [];
};

const getMemoryAnalytics = (userId) => {
  return memoryAnalytics.get(String(userId)) || null;
};

module.exports = { logActivity, getMemoryLogs, getMemoryAnalytics };
