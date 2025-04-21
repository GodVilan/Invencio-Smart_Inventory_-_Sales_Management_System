import React, { useEffect, useState } from 'react';
import { Card, Spinner, Alert, Button, Form } from 'react-bootstrap';
import { fetchSupplierProfile, updateSupplierProfile } from '../api';

const SupplierProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const data = await fetchSupplierProfile();
                setProfile(data);
                setFormData(data);
            } catch (error) {
                setError('Failed to fetch supplier profile.');
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = async () => {
        try {
            const updatedProfile = await updateSupplierProfile(formData);
            setProfile(updatedProfile);
            setEditing(false);
        } catch (error) {
            setError('Failed to update supplier profile.');
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
                <Alert variant="danger">{error}</Alert>
            </div>
        );
    }

    return (
        <Card className="mb-4 shadow-sm border-info">
            <Card.Body>
                <Card.Title>Supplier Profile</Card.Title>
                {editing ? (
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Contact Info</Form.Label>
                            <Form.Control
                                type="text"
                                name="contactInfo"
                                value={formData.contactInfo}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Button variant="primary" onClick={handleSave}>
                            Save
                        </Button>
                        <Button variant="secondary" className="ms-2" onClick={() => setEditing(false)}>
                            Cancel
                        </Button>
                    </Form>
                ) : (
                    <>
                        <p><strong>Name:</strong> {profile.name}</p>
                        <p><strong>Email:</strong> {profile.email || 'N/A'}</p>
                        <p><strong>Phone:</strong> {profile.phone || 'N/A'}</p>
                        <p><strong>Address:</strong> {profile.address || 'N/A'}</p>
                        <p><strong>Contact Info:</strong> {profile.contactInfo || 'N/A'}</p>
                        <Button variant="warning" onClick={() => setEditing(true)}>
                            Edit Profile
                        </Button>
                    </>
                )}
            </Card.Body>
        </Card>
    );
};

export default SupplierProfile;