const mongoose = require('mongoose');

const terminologySchema = new mongoose.Schema(
  {
    terminologyId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true
    },
    preferredTerm: {
      type: String,
      required: true,
      trim: true
    },
    prohibitedTerms: {
      type: [String],
      required: true,
      validate: [v => Array.isArray(v) && v.length > 0, 'At least one prohibited term is required']
    },
    explanation: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: ['Product Name', 'Brand Spelling', 'Trademark', 'Feature Name', 'Slogan'],
      default: 'Product Name'
    },
    severity: {
      type: String,
      enum: ['high', 'medium', 'low', 'advisory'],
      default: 'high'
    },
    caseSensitive: {
      type: Boolean,
      default: false
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

terminologySchema.index({ terminologyId: 1, status: 1 });

module.exports = mongoose.model('Terminology', terminologySchema);
