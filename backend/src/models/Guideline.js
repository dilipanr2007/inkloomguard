const mongoose = require('mongoose');

const guidelineSchema = new mongoose.Schema(
  {
    guidelineId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Brand Terminology',
        'Brand Tone',
        'Messaging Consistency',
        'Unsupported Claim',
        'Contradicted Fact',
        'Promotional Claim',
        'Style and Communication'
      ],
      default: 'Style and Communication'
    },
    severity: {
      type: String,
      enum: ['high', 'medium', 'low', 'advisory'],
      default: 'medium'
    },
    version: {
      type: String,
      default: '1.0'
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
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

guidelineSchema.index({ guidelineId: 1, status: 1 });

module.exports = mongoose.model('Guideline', guidelineSchema);
