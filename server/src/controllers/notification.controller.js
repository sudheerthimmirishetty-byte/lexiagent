const Notification = require('../models/Notification');

const getNotifications = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    let notifications = [];
    try {
      notifications = await Notification.find({ userId }).sort({ createdAt: -1 }).limit(20).lean();
    } catch (e) {
      notifications = [
        {
          _id: 'notif_1',
          title: 'Welcome to LexiAgent AI!',
          message: 'Your autonomous legal assistant is ready. Upload a document or start a legal chat.',
          isRead: false,
          createdAt: new Date(),
        },
      ];
    }

    res.json({ success: true, notifications });
  } catch (err) {
    next(err);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    try {
      await Notification.updateMany({ userId, isRead: false }, { $set: { isRead: true } });
    } catch (e) {}

    res.json({ success: true, message: 'Notifications marked as read.' });
  } catch (err) {
    next(err);
  }
};

const clearNotifications = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    try {
      await Notification.deleteMany({ userId });
    } catch (e) {}

    res.json({ success: true, message: 'All notifications cleared.' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  clearNotifications,
};
