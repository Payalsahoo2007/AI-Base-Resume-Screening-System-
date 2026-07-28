const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate' },
  originalName: { type: String, required: true },
  filePath: { type: String, required: true },
  fileSize: { type: Number, required: true },
  fileType: { type: String, required: true },
  fileHash: { type: String, default: '' },
  rawText: { type: String, required: true },
  parsedData: { type: Object, default: {} },
  isDuplicate: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Resume', resumeSchema);
