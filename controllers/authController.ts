import { Request, Response } from 'express';
import User from '../models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Op } from 'sequelize';

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { password } = req.body;
        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS || '10'));

        // Create a new user with the hashed password
        const user = await User.create({ ...req.body, password: hashedPassword });

        res.status(201).json({ message: 'User registered successfully', userId: user.userId });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            res.status(401).json({ message: 'Authentication failed' });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password || '');
        if (!isMatch) {
            res.status(401).json({ message: 'Authentication failed' });
            return;
        }

        const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET || '', { expiresIn: '1h' });

        res.status(200).json({ message: 'Authentication successful', token });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export const requestPasswordReset = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            res.status(404).send('User not found');
            return;
        }

        // Generate a reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        // Set token validity (e.g., 1 hour)
        const resetTokenExpires = new Date(Date.now() + 3600000);

        // Update user with reset token and expiry
        await user.update({ resetToken, resetTokenExpires });

        // Send email with reset token (implement sendResetEmail function)
        // sendResetEmail(user.email, `Your reset token is: ${resetToken}`);

        res.send('Password reset email sent.');
    } catch (error) {
        res.status(500).send('Error requesting password reset');
    }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, token, newPassword } = req.body;
        const user = await User.findOne({ 
            where: { 
                email, 
                resetToken: token, 
                resetTokenExpires: { [Op.gt]: new Date() } 
            } 
        });

        if (!user) {
            res.status(400).send('Password reset token is invalid or has expired.');
            return;
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, parseInt(process.env.SALT_ROUNDS || '10'));

        // Update user with new password and clear reset token fields
        await user.update({ password: hashedPassword, resetToken: null, resetTokenExpires: null });

        res.send('Password has been reset.');
    } catch (error) {
        res.status(500).send('Error resetting password');
    }
};
