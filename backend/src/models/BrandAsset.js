const mongoose = require('mongoose');

const brandAssetSchema = new mongoose.Schema(
  {
    assetId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['Color Palette', 'Typography', 'Logo Guidelines', 'Tagline', 'Voice Attribute'],
      default: 'Voice Attribute'
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    },
    version: {
      type: String,
      default: '1.0'
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    organization: {
      type: String,
      default: 'FreshPlus Global'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('BrandAsset', brandAssetSchema);
