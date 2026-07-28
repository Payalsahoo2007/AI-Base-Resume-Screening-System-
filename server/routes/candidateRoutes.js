const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');

router.get('/', candidateController.getCandidates);
router.get('/:id', candidateController.getCandidateById);
router.put('/:id/status', candidateController.updateCandidateStatus);
router.post('/:id/bookmark', candidateController.toggleBookmark);
router.post('/bulk-action', candidateController.bulkAction);

module.exports = router;
