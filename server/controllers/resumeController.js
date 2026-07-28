const parserService = require('../services/parserService');
const aiService = require('../services/aiService');
const path = require('path');
const fs = require('fs');

// In-memory mock store for fallback operations
let mockResumes = [];
let mockCandidates = [
  {
    _id: 'cand-1',
    fullName: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    phone: '+1 (555) 234-5678',
    address: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexrivera',
    github: 'github.com/alexrivera',
    portfolio: 'alexrivera.dev',
    totalExperienceYears: 5,
    skills: {
      hard: ['JavaScript', 'Node.js', 'Express.js', 'React', 'MongoDB', 'Python', 'Docker', 'AWS'],
      soft: ['Leadership', 'Problem Solving', 'Communication', 'Teamwork'],
      languages: ['English', 'Spanish'],
      certifications: ['AWS Certified Developer'],
      tools: ['Git', 'VS Code', 'Docker', 'Postman']
    },
    education: [{ degree: 'B.S. in Computer Science', institution: 'UC Berkeley', year: '2020', gpa: '3.8' }],
    experience: [{ title: 'Senior Software Engineer', company: 'Tech Corp', startDate: '2021', endDate: 'Present', durationYears: 3, description: 'Built scalable backend microservices and APIs.' }],
    summary: 'Senior Software Engineer with 5+ years building cloud-native web services and AI applications.',
    status: 'Shortlisted',
    overallAtsScore: 92,
    rating: 5,
    tags: ['Full Stack', 'AI Expert', 'Top Tier'],
    bookmarks: true
  },
  {
    _id: 'cand-2',
    fullName: 'Sophia Lin',
    email: 'sophia.lin@techworld.org',
    phone: '+1 (555) 876-5432',
    address: 'New York, NY',
    linkedin: 'linkedin.com/in/sophialin-dev',
    github: 'github.com/sophia-lin',
    portfolio: 'sophialin.io',
    totalExperienceYears: 4,
    skills: {
      hard: ['Python', 'Django', 'Machine Learning', 'TensorFlow', 'SQL', 'PostgreSQL', 'Docker'],
      soft: ['Agile', 'Critical Thinking', 'Mentoring'],
      languages: ['English', 'Mandarin'],
      certifications: ['TensorFlow Developer Certificate'],
      tools: ['Git', 'Jupyter', 'PyCharm']
    },
    education: [{ degree: 'M.S. in Data Science', institution: 'Columbia University', year: '2021', gpa: '3.9' }],
    experience: [{ title: 'AI Research Engineer', company: 'Neural Systems', startDate: '2021', endDate: 'Present', durationYears: 3, description: 'Trained NLP models and automated document classifiers.' }],
    summary: 'AI & Data Science Specialist proficient in Python, machine learning models, and document processing.',
    status: 'Interview Scheduled',
    overallAtsScore: 88,
    rating: 4,
    tags: ['Data Science', 'Machine Learning', 'Python'],
    bookmarks: true
  },
  {
    _id: 'cand-3',
    fullName: 'David Miller',
    email: 'david.miller@cloudsoft.com',
    phone: '+1 (555) 345-6789',
    address: 'Austin, TX',
    linkedin: 'linkedin.com/in/davidmiller-cloud',
    github: 'github.com/dmiller-ops',
    portfolio: '',
    totalExperienceYears: 6,
    skills: {
      hard: ['Docker', 'Kubernetes', 'AWS', 'Linux', 'CI/CD', 'Terraform', 'Golang'],
      soft: ['Time Management', 'Crisis Management', 'Teamwork'],
      languages: ['English'],
      certifications: ['Certified Kubernetes Administrator (CKA)'],
      tools: ['Git', 'Kubernetes', 'Helm', 'Grafana']
    },
    education: [{ degree: 'B.S. in Information Systems', institution: 'UT Austin', year: '2018', gpa: '3.6' }],
    experience: [{ title: 'DevOps Architect', company: 'Cloud Infrastructure Inc', startDate: '2019', endDate: 'Present', durationYears: 5, description: 'Managed multi-cloud infrastructure and deployment pipelines.' }],
    summary: 'DevOps & Site Reliability Engineer specialized in Kubernetes, Docker, and AWS automation.',
    status: 'New',
    overallAtsScore: 85,
    rating: 4,
    tags: ['DevOps', 'Kubernetes', 'Cloud'],
    bookmarks: false
  }
];

exports.uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No resume file uploaded.' });
    }

    const filePath = req.file.path;
    const fileType = path.extname(req.file.originalname);
    const rawText = await parserService.extractRawText(filePath, fileType);
    const parsedData = parserService.parseResumeText(rawText);

    // Build Candidate Profile from Parsed Data
    const newCandidate = {
      _id: 'cand-' + Date.now(),
      fullName: parsedData.fullName,
      email: parsedData.email,
      phone: parsedData.phone,
      address: parsedData.address,
      linkedin: parsedData.linkedin,
      github: parsedData.github,
      portfolio: parsedData.portfolio,
      totalExperienceYears: parsedData.totalExperienceYears,
      skills: parsedData.skills,
      education: parsedData.education,
      experience: parsedData.experience,
      summary: parsedData.summary,
      status: 'Parsed',
      overallAtsScore: Math.floor(Math.random() * 20) + 80,
      rating: 4,
      tags: parsedData.skills.hard.slice(0, 3),
      bookmarks: false,
      createdAt: new Date()
    };

    mockCandidates.unshift(newCandidate);

    res.status(201).json({
      success: true,
      message: 'Resume uploaded and parsed successfully by AI Engine.',
      file: {
        originalName: req.file.originalname,
        size: req.file.size,
        type: fileType
      },
      parsedCandidate: newCandidate,
      rawTextPreview: rawText.substring(0, 500)
    });
  } catch (error) {
    next(error);
  }
};

exports.parseTextDirect = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ success: false, message: 'Text content is required.' });
    }

    const parsedData = parserService.parseResumeText(text);
    res.json({
      success: true,
      message: 'Raw text parsed successfully.',
      parsedCandidate: parsedData
    });
  } catch (error) {
    next(error);
  }
};

module.exports.mockCandidates = mockCandidates;
