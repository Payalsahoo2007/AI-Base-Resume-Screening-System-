const Candidate = require('../models/Candidate');
const { mockCandidates } = require('./resumeController');
const db = require('../config/db');

exports.getCandidates = async (req, res, next) => {
  try {
    const { status, skill, search, sort } = req.query;

    let list = [...mockCandidates];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(c => 
        c.fullName.toLowerCase().includes(q) || 
        c.email.toLowerCase().includes(q) || 
        (c.skills?.hard || []).some(s => s.toLowerCase().includes(q))
      );
    }

    if (status) {
      list = list.filter(c => c.status.toLowerCase() === status.toLowerCase());
    }

    if (skill) {
      list = list.filter(c => (c.skills?.hard || []).some(s => s.toLowerCase() === skill.toLowerCase()));
    }

    if (sort === 'score_desc') {
      list.sort((a, b) => b.overallAtsScore - a.overallAtsScore);
    } else if (sort === 'exp_desc') {
      list.sort((a, b) => b.totalExperienceYears - a.totalExperienceYears);
    }

    res.json({
      success: true,
      count: list.length,
      candidates: list
    });
  } catch (error) {
    next(error);
  }
};

exports.getCandidateById = async (req, res, next) => {
  const { id } = req.params;
  const cand = mockCandidates.find(c => c._id === id || c.id === id);
  if (!cand) {
    return res.status(404).json({ success: false, message: 'Candidate not found.' });
  }
  res.json({ success: true, candidate: cand });
};

exports.updateCandidateStatus = async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  const cand = mockCandidates.find(c => c._id === id || c.id === id);
  if (cand) {
    cand.status = status;
    return res.json({ success: true, message: `Status updated to '${status}'`, candidate: cand });
  }

  res.json({ success: true, message: 'Candidate status updated.' });
};

exports.toggleBookmark = async (req, res, next) => {
  const { id } = req.params;
  const cand = mockCandidates.find(c => c._id === id || c.id === id);
  if (cand) {
    cand.bookmarks = !cand.bookmarks;
    return res.json({ success: true, isBookmarked: cand.bookmarks });
  }
  res.json({ success: true, isBookmarked: true });
};

exports.bulkAction = async (req, res, next) => {
  const { ids, action } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ success: false, message: 'Candidate IDs array required.' });
  }

  ids.forEach(id => {
    const cand = mockCandidates.find(c => c._id === id);
    if (cand) {
      if (action === 'Shortlist') cand.status = 'Shortlisted';
      if (action === 'Reject') cand.status = 'Rejected';
      if (action === 'Schedule Interview') cand.status = 'Interview Scheduled';
    }
  });

  res.json({ success: true, message: `Bulk action '${action}' applied to ${ids.length} candidate(s).` });
};
