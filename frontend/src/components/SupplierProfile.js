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
            const updated = await updateSupplierProfile(formData);
            setProfile(updated);
            setEditing(false);
        } catch (error) {
            setError('Failed to update supplier profile.');
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '40vh' }}>
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="danger" className="text-center my-4">{error}</Alert>
        );
    }

    return (
        <Card className="shadow-sm border-0 rounded-4 mb-4">
            <Card.Body>
                <Card.Title className="text-purple fw-bold mb-4">Supplier Profile</Card.Title>

                {editing ? (
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name || ''}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email || ''}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control
                                type="text"
                                name="phone"
                                value={formData.phone || ''}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                                type="text"
                                name="address"
                                value={formData.address || ''}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Contact Info</Form.Label>
                            <Form.Control
                                type="text"
                                name="contactInfo"
                                value={formData.contactInfo || ''}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-end">
                            <Button variant="primary" onClick={handleSave}>
                                Save
                            </Button>
                            <Button variant="secondary" className="ms-2" onClick={() => setEditing(false)}>
                                Cancel
                            </Button>
                        </div>
                    </Form>
                ) : (
                    <>
                        <p><strong>Name:</strong> {profile.name}</p>
                        <p><strong>Email:</strong> {profile.email || 'N/A'}</p>
                        <p><strong>Phone:</strong> {profile.phone || 'N/A'}</p>
                        <p><strong>Address:</strong> {profile.address || 'N/A'}</p>
                        <p><strong>Contact Info:</strong> {profile.contactInfo || 'N/A'}</p>

                        <div className="d-flex justify-content-end">
                            <Button variant="warning" onClick={() => setEditing(true)}>
                                Edit Profile
                            </Button>
                        </div>
                    </>
                )}
            </Card.Body>

            <style>{`
                .text-purple {
                    color: #7e5bef;
                }

                .btn-warning:hover {
                    background-color: #ff922b;
                    border-color: #ff922b;
                }
            `}</style>
        </Card>
    );
};

export default SupplierProfile;