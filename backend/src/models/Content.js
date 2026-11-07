const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    contentType: {
      type: String,
      required: true,
      enum: [
        'Social Media Post',
        'Advertisement',
        'Marketing Email',
        'Website Copy',
        'Product Description',
        'General Marketing'
      ],
      default: 'General Marketing'
    },
    campaign: {
      type: String,
      default: 'General Campaign'
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    currentVersion: {
      type: Number,
      default: 1
    },
    status: {
      type: String,
      enum: ['draft', 'ai_reviewed', 'in_review', 'changes_requested', 'approved'],
      default: 'draft'
    },
    lastReviewedAt: {
      type: Date
    },
    reviewedBy: {
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

contentSchema.index({ creator: 1, status: 1 });

module.exports = mongoose.model('Content', contentSchema);
