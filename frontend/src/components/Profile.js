import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserProfile } from '../api';
import { Container, Card, Spinner, Alert, Button } from 'react-bootstrap';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const data = await fetchUserProfile();
                setProfile(data);
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Failed to load profile.';
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };
        loadProfile();
    }, []);

    if (loading) return <Spinner animation="border" className="d-block mx-auto" />;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <Container className="mt-4">
            <Card className="shadow-lg">
                <Card.Body>
                    <h2 className="text-center mb-4">Profile</h2>
                    <p><strong>Name:</strong> {profile.name}</p>
                    <p><strong>Email:</strong> {profile.email}</p>
                    <p><strong>Role:</strong> {profile.role}</p>
                    <hr />
                    <Button
                        variant="primary"
                        className="w-100"
                        onClick={() => navigate('/change-password')}
                    >
                        Change Password
                    </Button>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Profile;