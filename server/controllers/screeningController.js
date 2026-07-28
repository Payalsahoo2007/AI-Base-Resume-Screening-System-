const aiService = require('../services/aiService');
const { mockCandidates } = require('./resumeController');

exports.matchCandidateToJob = async (req, res, next) => {
  try {
    const { candidateId, jobId, candidateData, jobData } = req.body;

    let targetCandidate = candidateData;
    if (!targetCandidate && candidateId) {
      targetCandidate = mockCandidates.find(c => c._id === candidateId || c.id === candidateId);
    }

    if (!targetCandidate) {
      targetCandidate = mockCandidates[0];
    }

    let targetJob = jobData;
    if (!targetJob) {
      targetJob = {
        title: 'Senior AI / Full Stack Engineer',
        minExperienceYears: 4,
        requiredSkills: ['JavaScript', 'Node.js', 'Express.js', 'MongoDB', 'Python'],
        preferredSkills: ['OpenAI', 'Docker', 'AWS', 'System Architecture'],
        keywords: ['AI', 'Scalability', 'Microservices', 'REST API']
      };
    }

    const screeningResult = await aiService.screenResume(targetCandidate, targetJob);

    res.json({
      success: true,
      candidate: targetCandidate,
      job: targetJob,
      matchResult: screeningResult
    });
  } catch (error) {
    next(error);
  }
};

exports.bulkScreenCandidates = async (req, res, next) => {
  try {
    const { jobId } = req.body;

    const results = [];
    for (const cand of mockCandidates) {
      const match = await aiService.screenResume(cand, {
        title: 'Senior Engineer',
        minExperienceYears: 3,
        requiredSkills: ['JavaScript', 'Node.js', 'Python', 'MongoDB']
      });
      results.push({ candidate: cand, match });
    }

    results.sort((a, b) => b.match.overallMatchScore - a.match.overallMatchScore);

    res.json({
      success: true,
      totalScreened: results.length,
      rankedCandidates: results
    });
  } catch (error) {
    next(error);
  }
};
