import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'seller',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.password || !formData.role) {
            setError('All fields are required.');
            return;
        }

        setLoading(true);
        try {
            await api.post('/auth/register', formData);
            alert('Registration successful! Please log in.');
            navigate('/login');
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light-purple">
            <Container>
                <Row className="justify-content-center">
                    <Col md={7} lg={6}>
                        <Card className="p-4 shadow border-0">
                            <Card.Body>
                                <h2 className="text-center mb-4 text-purple fw-bold">Register</h2>
                                {error && <Alert variant="danger">{error}</Alert>}
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3" controlId="formName">
                                        <Form.Label className="fw-semibold text-muted">Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="name"
                                            placeholder="Enter your name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="rounded-3"
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formEmail">
                                        <Form.Label className="fw-semibold text-muted">Email address</Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            placeholder="Enter email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="rounded-3"
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formPassword">
                                        <Form.Label className="fw-semibold text-muted">Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="password"
                                            placeholder="Enter password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            className="rounded-3"
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-4" controlId="formRole">
                                        <Form.Label className="fw-semibold text-muted">Role</Form.Label>
                                        <Form.Select
                                            name="role"
                                            value={formData.role}
                                            onChange={handleChange}
                                            className="rounded-3"
                                        >
                                            {/* <option value="admin">Admin</option> */}
                                            <option value="seller">Seller</option>
                                            <option value="supplier">Supplier</option>
                                        </Form.Select>
                                    </Form.Group>
                                    <Button
                                        type="submit"
                                        variant="warning"
                                        className="w-100 fw-semibold text-white rounded-3"
                                        disabled={loading}
                                    >
                                        {loading ? 'Registering...' : 'Register'}
                                    </Button>
                                </Form>
                                <div className="text-center mt-3 text-muted">
                                    Already have an account?{' '}
                                    <Link to="/login" className="text-purple fw-medium text-decoration-none">
                                        Login
                                    </Link>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* Utility styles */}
            <style>{`
                .bg-light-purple {
                    background-color: #fef9ff;
                }

                .text-purple {
                    color: #7e5bef !important;
                }

                .text-purple:hover {
                    color: #5a41c5 !important;
                }
            `}</style>
        </div>
    );
};

export default Register;