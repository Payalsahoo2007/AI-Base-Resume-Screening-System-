const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

router.get('/csv', reportController.exportCandidateCsv);
router.get('/json', reportController.exportCandidateJson);
router.get('/pdf', reportController.exportPdfReport);

module.exports = router;
