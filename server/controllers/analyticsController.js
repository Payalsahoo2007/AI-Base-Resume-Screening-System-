exports.getDashboardAnalytics = async (req, res) => {
  res.json({
    success: true,
    stats: {
      totalCandidates: 284,
      newApplications: 42,
      shortlisted: 68,
      rejected: 31,
      interviewScheduled: 18,
      offersSent: 9,
      averageAtsScore: 86.4,
      atsCompatibility: '94.2%',
      averageExperienceYears: 4.8
    },
    hiringFunnel: [
      { stage: 'Resumes Received', count: 284 },
      { stage: 'AI Screened', count: 210 },
      { stage: 'Shortlisted', count: 68 },
      { stage: 'Interviewed', count: 18 },
      { stage: 'Offered', count: 9 },
      { stage: 'Hired', count: 6 }
    ],
    skillsDistribution: [
      { skill: 'JavaScript / Node.js', count: 142 },
      { skill: 'Python / ML', count: 98 },
      { skill: 'React / Frontend', count: 85 },
      { skill: 'Docker / K8s', count: 74 },
      { skill: 'SQL / MongoDB', count: 120 },
      { skill: 'AWS / Cloud', count: 65 }
    ],
    atsScoreDistribution: [
      { range: '90-100 (Top Match)', count: 48 },
      { range: '80-89 (Strong Match)', count: 95 },
      { range: '70-79 (Moderate)', count: 82 },
      { range: '60-69 (Weak Match)', count: 41 },
      { range: '<60 (Unqualified)', count: 18 }
    ],
    departmentAnalytics: [
      { department: 'Engineering', activeJobs: 6, candidates: 140 },
      { department: 'Talent Acquisition', activeJobs: 3, candidates: 45 },
      { department: 'Infrastructure / DevOps', activeJobs: 4, candidates: 62 },
      { department: 'Product & Design', activeJobs: 2, candidates: 37 }
    ],
    radarMetrics: {
      labels: ['Technical Skill', 'Experience Match', 'ATS Formatting', 'Education', 'Culture Fit', 'Keyword Overlap'],
      candidateScores: [92, 88, 95, 84, 90, 86],
      jobBenchmark: [85, 80, 90, 80, 85, 80]
    }
  });
};
