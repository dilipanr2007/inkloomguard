const mongoose = require('mongoose');

const findingSchema = new mongoose.Schema(
  {
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Content',
      required: true
    },
    versionNumber: {
      type: Number,
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
      ]
    },
    severity: {
      type: String,
      required: true,
      enum: ['high', 'medium', 'low', 'advisory']
    },
    excerpt: {
      type: String,
      required: true
    },
    reason: {
      type: String,
      required: true
    },
    evidenceStatus: {
      type: String,
      required: true,
      enum: ['supported', 'contradicted', 'unsupported', 'advisory']
    },
    sourceIds: {
      type: [String],
      default: []
    },
    sourceExcerpt: {
      type: String,
      default: ''
    },
    suggestedRewrite: {
      type: String,
      default: ''
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.9
    },
    decision: {
      type: String,
      enum: ['pending', 'accepted', 'edited', 'dismissed'],
      default: 'pending'
    },
    dismissalReason: {
      type: String,
      default: ''
    },
    editedRewrite: {
      type: String,
      default: ''
    },
    decidedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    decidedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

findingSchema.index({ contentId: 1, versionNumber: 1 });
findingSchema.index({ category: 1, severity: 1, decision: 1 });

module.exports = mongoose.model('Finding', findingSchema);
