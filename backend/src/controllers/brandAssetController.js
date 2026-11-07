const BrandAsset = require('../models/BrandAsset');
const { logAudit } = require('../utils/auditLogger');

const getAssets = async (req, res, next) => {
  try {
    const assets = await BrandAsset.find({ status: 'active' }).sort({ assetId: 1 });
    res.json({ success: true, count: assets.length, assets });
  } catch (error) {
    next(error);
  }
};

const createAsset = async (req, res, next) => {
  try {
    const { assetId, name, type, details, status } = req.body;
    const asset = await BrandAsset.create({
      assetId: assetId.toUpperCase(),
      name,
      type,
      details,
      status: status || 'active',
      createdBy: req.user._id,
      organization: req.user.organization
    });

    await logAudit({
      user: req.user,
      role: req.user.role,
      action: 'CREATE_BRAND_ASSET',
      targetResource: 'BrandAsset',
      targetId: asset._id,
      details: { assetId: asset.assetId, name: asset.name }
    });

    res.status(201).json({ success: true, asset });
  } catch (error) {
    next(error);
  }
};

const updateAsset = async (req, res, next) => {
  try {
    const asset = await BrandAsset.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!asset) return res.status(404).json({ success: false, message: 'Asset not found' });
    res.json({ success: true, asset });
  } catch (error) {
    next(error);
  }
};

const deleteAsset = async (req, res, next) => {
  try {
    const asset = await BrandAsset.findByIdAndDelete(req.params.id);
    if (!asset) return res.status(404).json({ success: false, message: 'Asset not found' });
    res.json({ success: true, message: 'Asset deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAssets,
  createAsset,
  updateAsset,
  deleteAsset
};
