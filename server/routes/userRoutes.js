const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/', authenticate, adminController.getUsers);
router.post('/role', authenticate, adminController.updateUserRole);

module.exports = router;
