const express = require('express');
const router = express.Router();
const screeningController = require('../controllers/screeningController');

router.post('/match', screeningController.matchCandidateToJob);
router.post('/bulk-screen', screeningController.bulkScreenCandidates);

module.exports = router;
