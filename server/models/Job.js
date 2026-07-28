const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  department: { type: String, required: true },
  location: { type: String, default: 'Remote / Hybrid' },
  employmentType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'],
    default: 'Full-time'
  },
  minExperienceYears: { type: Number, default: 2 },
  salaryRange: { type: String, default: '$100,000 - $140,000' },
  description: { type: String, required: true },
  requiredSkills: [String],
  preferredSkills: [String],
  keywords: [String],
  status: {
    type: String,
    enum: ['Active', 'Draft', 'Archived', 'Closed'],
    default: 'Active'
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  applicationsCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
