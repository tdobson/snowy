import express from 'express';
import { register, login, requestPasswordReset, resetPassword } from '../controllers/authController';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/requestReset', requestPasswordReset); // Route to request a password reset
router.post('/reset', resetPassword); // Route to reset the password

export default router;
