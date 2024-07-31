// ./controllers/authController.js
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// Include any library for sending emails, like nodemailer

exports.register = async (req, res) => {
    try {
        const { password } = req.body;
        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));

        // Create a new user with the hashed password
        const user = await User.create({ ...req.body, password: hashedPassword });

        res.status(201).json({ message: 'User registered successfully', userId: user.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ message: 'Authentication failed' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Authentication failed' });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Authentication successful', token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).send('User not found');
        }

        // Generate a reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        // Set token validity (e.g., 1 hour)
        const resetTokenExpires = Date.now() + 3600000;

        // Update user with reset token and expiry
        await user.update({ resetToken, resetTokenExpires });

        // Send email with reset token (implement sendResetEmail function)
        // sendResetEmail(user.email, `Your reset token is: ${resetToken}`);

        res.send('Password reset email sent.');
    } catch (error) {
        res.status(500).send('Error requesting password reset');
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { email, token, newPassword } = req.body;
        const user = await User.findOne({ where: { email, resetToken: token, resetTokenExpires: { [Op.gt]: Date.now() } } });

        if (!user) {
            return res.status(400).send('Password reset token is invalid or has expired.');
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, parseInt(process.env.SALT_ROUNDS));

        // Update user with new password and clear reset token fields
        await user.update({ password: hashedPassword, resetToken: null, resetTokenExpires: null });

        res.send('Password has been reset.');
    } catch (error) {
        res.status(500).send('Error resetting password');
    }
};