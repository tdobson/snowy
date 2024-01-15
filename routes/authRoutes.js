// ./routes/authRoutes.js
const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/requestReset', authController.requestPasswordReset); // Route to request a password reset
router.post('/reset', authController.resetPassword); // Route to reset the password

module.exports = router;
