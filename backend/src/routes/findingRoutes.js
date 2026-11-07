const express = require('express');
const router = express.Router();
const { updateFindingDecision } = require('../controllers/findingController');
const { protect } = require('../middleware/auth');

router.patch('/:id/decision', protect, updateFindingDecision);

module.exports = router;
