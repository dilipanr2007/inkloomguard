const mongoose = require('mongoose');

const contentVersionSchema = new mongoose.Schema(
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
    rawText: {
      type: String,
      required: true
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    changeNotes: {
      type: String,
      default: ''
    },
    aiReviewCompleted: {
      type: Boolean,
      default: false
    },
    governanceScore: {
      type: Number,
      default: null
    },
    totalFindings: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

contentVersionSchema.index({ contentId: 1, versionNumber: 1 }, { unique: true });

module.exports = mongoose.model('ContentVersion', contentVersionSchema);
