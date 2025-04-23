import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api, { setAuthToken } from '../api';
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';

const Login = ({ setRole }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, role } = response.data;

            sessionStorage.setItem('token', token);
            setAuthToken(token);
            setRole(role);

            if (role === 'admin') navigate('/dashboard');
            else if (role === 'seller') navigate('/seller');
            else if (role === 'supplier') navigate('/supplier');
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light-purple">
            <Container>
                <Row className="justify-content-center">
                    <Col md={6} lg={5}>
                        <Card className="p-4 shadow border-0">
                            <Card.Body>
                                <h2 className="text-center mb-4 text-purple fw-bold">Login</h2>
                                {error && <Alert variant="danger">{error}</Alert>}
                                <Form onSubmit={handleLogin}>
                                    <Form.Group className="mb-3" controlId="formEmail">
                                        <Form.Label className="fw-semibold text-muted">Email address</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="Enter email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="rounded-3"
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formPassword">
                                        <Form.Label className="fw-semibold text-muted">Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Enter password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="rounded-3"
                                        />
                                    </Form.Group>
                                    <Button
                                        type="submit"
                                        variant="warning"
                                        className="w-100 fw-semibold text-white rounded-3"
                                        disabled={loading}
                                    >
                                        {loading ? 'Logging in...' : 'Login'}
                                    </Button>
                                </Form>
                                <div className="text-center mt-3">
                                    <Link to="/forgot-password" className="text-purple text-decoration-none fw-medium">
                                        Forgot Password?
                                    </Link>
                                </div>
                                <div className="text-center mt-2 text-muted">
                                    Don't have an account?{' '}
                                    <Link to="/register" className="text-purple fw-medium text-decoration-none">
                                        Sign Up
                                    </Link>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* Theme Utility Classes */}
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

export default Login;