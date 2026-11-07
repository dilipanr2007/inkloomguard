const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
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
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      required: true
    },
    comment: {
      type: String,
      required: true,
      trim: true
    },
    findingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Finding'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Comment', commentSchema);
