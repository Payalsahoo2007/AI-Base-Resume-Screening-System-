const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  interviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  scheduledAt: { type: Date, required: true },
  durationMinutes: { type: Number, default: 45 },
  locationType: { type: String, enum: ['Google Meet', 'Zoom', 'In-Person', 'Phone'], default: 'Google Meet' },
  meetingUrl: { type: String, default: '' },
  status: {
    type: String,
    enum: ['Scheduled', 'Completed', 'Cancelled', 'Rescheduled'],
    default: 'Scheduled'
  },
  ratings: {
    technical: { type: Number, min: 1, max: 5 },
    communication: { type: Number, min: 1, max: 5 },
    cultureFit: { type: Number, min: 1, max: 5 },
    overall: { type: Number, min: 1, max: 5 }
  },
  feedbackNotes: String,
  decision: { type: String, enum: ['Strong Hire', 'Hire', 'Reject', 'Pending'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Interview', interviewSchema);
