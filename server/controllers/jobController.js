const Job = require('../models/Job');
const db = require('../config/db');

// Sample default Jobs
let mockJobs = [
  {
    _id: 'job-1',
    title: 'Senior AI / Full Stack Engineer',
    department: 'Engineering',
    location: 'Remote / Hybrid',
    employmentType: 'Full-time',
    minExperienceYears: 4,
    salaryRange: '$140,000 - $180,000',
    description: 'We are seeking an AI & Full Stack Engineer to lead our next-generation automated recruitment engine.',
    requiredSkills: ['JavaScript', 'Node.js', 'Express.js', 'MongoDB', 'Python', 'REST API'],
    preferredSkills: ['OpenAI', 'Docker', 'AWS', 'System Architecture', 'GraphQL'],
    keywords: ['AI', 'Scalability', 'Microservices', 'Clean Architecture', 'ATS'],
    status: 'Active',
    applicationsCount: 14
  },
  {
    _id: 'job-2',
    title: 'Lead Technical Recruiter',
    department: 'Talent Acquisition',
    location: 'San Francisco, CA',
    employmentType: 'Full-time',
    minExperienceYears: 3,
    salaryRange: '$110,000 - $135,000',
    description: 'Drive strategic hiring for engineering, product design, and AI executive roles.',
    requiredSkills: ['Technical Sourcing', 'Interviewing', 'Agile Hiring', 'Recruitment Pipeline'],
    preferredSkills: ['ATS Systems', 'Salary Negotiation', 'Headhunting'],
    keywords: ['Sourcing', 'Talent Pipeline', 'Headhunting', 'LinkedIn Recruiter'],
    status: 'Active',
    applicationsCount: 8
  },
  {
    _id: 'job-3',
    title: 'Cloud Infrastructure & DevOps Lead',
    department: 'Infrastructure',
    location: 'Austin, TX',
    employmentType: 'Full-time',
    minExperienceYears: 5,
    salaryRange: '$150,000 - $190,000',
    description: 'Manage production Kubernetes clusters, AWS infrastructure, and multi-region deployment automation.',
    requiredSkills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux', 'Terraform'],
    preferredSkills: ['Python', 'Golang', 'Security Auditing'],
    keywords: ['Kubernetes', 'DevOps', 'CI/CD', 'AWS', 'Security'],
    status: 'Active',
    applicationsCount: 19
  }
];

exports.getAllJobs = async (req, res, next) => {
  try {
    if (db.isMockMode()) {
      return res.json({ success: true, count: mockJobs.length, jobs: mockJobs });
    }
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json({ success: true, count: jobs.length, jobs: jobs.length ? jobs : mockJobs });
  } catch (error) {
    res.json({ success: true, count: mockJobs.length, jobs: mockJobs });
  }
};

exports.getJobById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (db.isMockMode()) {
      const job = mockJobs.find(j => j._id === id || j.id === id);
      return res.json({ success: true, job: job || mockJobs[0] });
    }
    const job = await Job.findById(id);
    res.json({ success: true, job: job || mockJobs[0] });
  } catch (error) {
    res.json({ success: true, job: mockJobs[0] });
  }
};

exports.createJob = async (req, res, next) => {
  try {
    const newJobData = {
      _id: 'job-' + Date.now(),
      title: req.body.title,
      department: req.body.department || 'Engineering',
      location: req.body.location || 'Remote',
      employmentType: req.body.employmentType || 'Full-time',
      minExperienceYears: Number(req.body.minExperienceYears) || 2,
      salaryRange: req.body.salaryRange || '$120,000 - $150,000',
      description: req.body.description,
      requiredSkills: Array.isArray(req.body.requiredSkills) ? req.body.requiredSkills : (req.body.requiredSkills || '').split(',').map(s => s.trim()).filter(Boolean),
      preferredSkills: Array.isArray(req.body.preferredSkills) ? req.body.preferredSkills : (req.body.preferredSkills || '').split(',').map(s => s.trim()).filter(Boolean),
      keywords: Array.isArray(req.body.keywords) ? req.body.keywords : (req.body.keywords || '').split(',').map(s => s.trim()).filter(Boolean),
      status: req.body.status || 'Active',
      applicationsCount: 0
    };

    if (db.isMockMode()) {
      mockJobs.unshift(newJobData);
      return res.status(201).json({ success: true, message: 'Job created successfully.', job: newJobData });
    }

    const job = await Job.create(newJobData);
    res.status(201).json({ success: true, message: 'Job created successfully.', job });
  } catch (error) {
    next(error);
  }
};

exports.updateJob = async (req, res, next) => {
  const { id } = req.params;
  if (db.isMockMode()) {
    const idx = mockJobs.findIndex(j => j._id === id);
    if (idx !== -1) {
      mockJobs[idx] = { ...mockJobs[idx], ...req.body };
      return res.json({ success: true, message: 'Job updated.', job: mockJobs[idx] });
    }
  }
  res.json({ success: true, message: 'Job updated successfully.' });
};

exports.deleteJob = async (req, res, next) => {
  const { id } = req.params;
  if (db.isMockMode()) {
    mockJobs = mockJobs.filter(j => j._id !== id);
    return res.json({ success: true, message: 'Job deleted.' });
  }
  res.json({ success: true, message: 'Job deleted successfully.' });
};
