const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
  resumeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume' },
  overallMatchScore: { type: Number, default: 0 }, // 0 - 100
  scoreBreakdown: {
    atsScore: Number,
    keywordMatchScore: Number,
    experienceMatchScore: Number,
    skillMatchScore: Number,
    educationMatchScore: Number,
    readabilityScore: Number
  },
  matchingSkills: [String],
  missingSkills: [String],
  missingKeywords: [String],
  aiAnalysis: {
    strengths: [String],
    weaknesses: [String],
    suggestions: [String],
    interviewQuestions: [String],
    hiringRecommendation: {
      type: String,
      enum: ['Strong Hire', 'Hire', 'Consider', 'Reject'],
      default: 'Consider'
    }
  },
  stage: {
    type: String,
    enum: ['New', 'AI Screened', 'Shortlisted', 'Interview Scheduled', 'Offered', 'Rejected'],
    default: 'New'
  }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
