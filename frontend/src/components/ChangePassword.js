import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { updatePassword } from '../api';

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updatePassword(currentPassword, newPassword);
            setSuccess('Password updated successfully');
            setError('');
            setCurrentPassword('');
            setNewPassword('');
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to update password';
            setError(errorMessage);
            setSuccess('');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form onSubmit={handleChangePassword}>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form.Group className="mb-3">
                <Form.Label>Current Password</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                />
            </Form.Group>
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
            <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Updating...' : 'Change Password'}
            </Button>
        </Form>
    );
};

export default ChangePassword;