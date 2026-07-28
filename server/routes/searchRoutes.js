const express = require('express');
const router = express.Router();
const { mockCandidates } = require('../controllers/resumeController');

router.get('/', (req, res) => {
  const query = (req.query.q || '').toLowerCase();
  if (!query) {
    return res.json({ success: true, results: [] });
  }

  const candidateMatches = mockCandidates.filter(c => 
    c.fullName.toLowerCase().includes(query) ||
    c.email.toLowerCase().includes(query) ||
    (c.skills?.hard || []).some(s => s.toLowerCase().includes(query))
  );

  res.json({
    success: true,
    query,
    total: candidateMatches.length,
    results: candidateMatches
  });
});

module.exports = router;
