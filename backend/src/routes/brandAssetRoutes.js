const express = require('express');
const router = express.Router();
const {
  getAssets,
  createAsset,
  updateAsset,
  deleteAsset
} = require('../controllers/brandAssetController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

router.route('/')
  .get(protect, getAssets)
  .post(protect, authorize('manager'), createAsset);

router.route('/:id')
  .put(protect, authorize('manager'), updateAsset)
  .delete(protect, authorize('manager'), deleteAsset);

module.exports = router;
