const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  clearNotifications,
} = require('../controllers/notification.controller');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getNotifications);
router.put('/read', markAsRead);
router.delete('/', clearNotifications);

module.exports = router;
