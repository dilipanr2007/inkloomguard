const mongoose = require('mongoose');

const approvedFactSchema = new mongoose.Schema(
  {
    factId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true
    },
    statement: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      enum: ['Ingredients', 'Nutrition', 'Certifications', 'Origin', 'Packaging', 'Operations'],
      default: 'Ingredients'
    },
    sourceDoc: {
      type: String,
      required: true,
      trim: true
    },
    verificationDate: {
      type: Date,
      default: Date.now
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

approvedFactSchema.index({ factId: 1, status: 1 });

module.exports = mongoose.model('ApprovedFact', approvedFactSchema);
