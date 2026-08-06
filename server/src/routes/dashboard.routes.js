const express = require('express');
const router = express.Router();
const {
  getDashboardOverview,
  getStatsOnly,
  getRecentActivities,
} = require('../controllers/dashboard.controller');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getDashboardOverview);
router.get('/stats', getStatsOnly);
router.get('/recent', getRecentActivities);

module.exports = router;
