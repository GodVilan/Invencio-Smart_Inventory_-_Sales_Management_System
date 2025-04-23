const User = require('../models/User');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const otpStore = {}; // Temporary in-memory store for OTPs

// Send OTP to user's email
const sendOtp = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const otp = crypto.randomInt(100000, 999999).toString();
        otpStore[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 }; // OTP valid for 5 minutes

        // Configure nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP for Password Reset',
            text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'OTP sent to email' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error sending OTP' });
    }
};

// Verify OTP
const verifyOtp = (req, res) => {
    const { email, otp } = req.body;

    if (!otpStore[email] || otpStore[email].otp !== otp) {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    res.status(200).json({ message: 'OTP verified successfully' });
};

// Reset Password
const resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        user.password = newPassword;
        await user.save();

        delete otpStore[email]; // Clear OTP after successful password reset

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error resetting password' });
    }
};

module.exports = { sendOtp, verifyOtp, resetPassword };