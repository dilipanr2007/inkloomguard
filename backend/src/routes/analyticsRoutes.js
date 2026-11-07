const express = require('express');
const router = express.Router();
const {
  getOverviewAnalytics,
  getFindingsAnalytics,
  getRulesAnalytics
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

router.get('/overview', protect, getOverviewAnalytics);
router.get('/findings', protect, getFindingsAnalytics);
router.get('/rules', protect, getRulesAnalytics);

module.exports = router;
