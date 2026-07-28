const aiService = require('./aiService');

/**
 * Matching Engine service for bulk candidate ranking against Job Description
 */
const compareCandidateToJob = async (candidate, job) => {
  return await aiService.screenResume(candidate, job);
};

const rankCandidatesForJob = async (candidates, job) => {
  const ranked = [];
  for (const candidate of candidates) {
    const matchResult = await aiService.screenResume(candidate, job);
    ranked.push({
      candidate,
      matchResult
    });
  }
  return ranked.sort((a, b) => b.matchResult.overallMatchScore - a.matchResult.overallMatchScore);
};

module.exports = { compareCandidateToJob, rankCandidatesForJob };
