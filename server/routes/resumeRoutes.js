const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');
const upload = require('../middleware/uploadMiddleware');

router.post('/upload', upload.single('resume'), resumeController.uploadResume);
router.post('/parse-text', resumeController.parseTextDirect);

module.exports = router;
