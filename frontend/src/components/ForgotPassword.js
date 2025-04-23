import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Container, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [step, setStep] = useState(1);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Automatically clear alerts after 5 seconds
    useEffect(() => {
        if (message || error) {
            const timer = setTimeout(() => {
                setMessage('');
                setError('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [message, error]);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        try {
            await api.post('/forgot-password/send-otp', { email });
            setMessage('OTP sent to your email');
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || 'Error sending OTP');
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        try {
            await api.post('/forgot-password/verify-otp', { email, otp });
            setMessage('OTP verified. You can now reset your password.');
            setStep(3);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP');
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmNewPassword) {
            setError('Passwords do not match');
            return;
        }
        try {
            await api.post('/forgot-password/reset-password', { email, newPassword });
            setMessage('Password reset successfully. Redirecting to login...');
            setTimeout(() => {
                navigate('/login'); // Redirect to login page
            }, 3000); // Redirect after 3 seconds
        } catch (err) {
            setError(err.response?.data?.message || 'Error resetting password');
        }
    };

    return (
        <Container className="mt-4">
            <Card className="shadow-lg">
                <Card.Body>
                    <h2 className="text-center mb-4">Forgot Password</h2>
                    {message && <Alert variant="success">{message}</Alert>}
                    {error && <Alert variant="danger">{error}</Alert>}
                    {step === 1 && (
                        <Form onSubmit={handleSendOtp}>
                            <Form.Group className="mb-3">
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Button type="submit" variant="primary" className="w-100">
                                Send OTP
                            </Button>
                        </Form>
                    )}
                    {step === 2 && (
                        <Form onSubmit={handleVerifyOtp}>
                            <Form.Group className="mb-3">
                                <Form.Label>OTP</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter the OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Button type="submit" variant="primary" className="w-100">
                                Verify OTP
                            </Button>
                        </Form>
                    )}
                    {step === 3 && (
                        <Form onSubmit={handleResetPassword}>
                            <Form.Group className="mb-3">
                                <Form.Label>New Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Confirm New Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Confirm new password"
                                    value={confirmNewPassword}
                                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Button type="submit" variant="primary" className="w-100">
                                Reset Password
                            </Button>
                        </Form>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ForgotPassword;