const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  github: { type: String, default: '' },
  portfolio: { type: String, default: '' },
  education: [{
    degree: String,
    institution: String,
    year: String,
    gpa: String
  }],
  experience: [{
    title: String,
    company: String,
    startDate: String,
    endDate: String,
    durationYears: Number,
    description: String
  }],
  totalExperienceYears: { type: Number, default: 0 },
  skills: {
    hard: [String],
    soft: [String],
    languages: [String],
    certifications: [String],
    tools: [String]
  },
  summary: { type: String, default: '' },
  status: {
    type: String,
    enum: ['New', 'Parsed', 'Shortlisted', 'Interview Scheduled', 'Offered', 'Rejected', 'Hired'],
    default: 'New'
  },
  overallAtsScore: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  tags: [String],
  bookmarks: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Candidate', candidateSchema);
