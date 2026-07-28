const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interviewController');

router.get('/', interviewController.getInterviews);
router.post('/schedule', interviewController.scheduleInterview);
router.put('/:id/feedback', interviewController.updateFeedback);

module.exports = router;
