import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';

const Dashboard = () => {
    const [role, setRole] = useState('');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch user role from sessionStorage or backend
        const fetchRole = async () => {
            const token = sessionStorage.getItem('token'); // Use sessionStorage
            if (token) {
                try {
                    const response = await axios.get('http://localhost:5050/api/auth/me', {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setRole(response.data.role);
                } catch (error) {
                    console.error('Error fetching role:', error);
                    setError('Failed to fetch user role.');
                }
            }
        };

        fetchRole();
    }, []);

    useEffect(() => {
        // Fetch role-specific data
        const fetchData = async () => {
            if (role) {
                try {
                    let response;
                    if (role === 'admin') {
                        response = await axios.get('http://localhost:5050/api/admin');
                    } else if (role === 'seller') {
                        response = await axios.get('http://localhost:5050/api/seller');
                    } else if (role === 'supplier') {
                        response = await axios.get('http://localhost:5050/api/supplier');
                    }
                    setData(response.data);
                } catch (error) {
                    console.error('Error fetching dashboard data:', error);
                    setError('Failed to fetch dashboard data.');
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchData();
    }, [role]);

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <Spinner animation="border" variant="primary" />
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <h1 className="text-center mb-4">{role.charAt(0).toUpperCase() + role.slice(1)} Dashboard</h1>
            <Row>
                {role === 'admin' && (
                    <>
                        <Col md={4}>
                            <Card className="mb-4 shadow-sm">
                                <Card.Body>
                                    <Card.Title>Total Users</Card.Title>
                                    <Card.Text>{data?.totalUsers || 'N/A'}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className="mb-4 shadow-sm">
                                <Card.Body>
                                    <Card.Title>Total Products</Card.Title>
                                    <Card.Text>{data?.totalProducts || 'N/A'}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className="mb-4 shadow-sm">
                                <Card.Body>
                                    <Card.Title>Total Sales</Card.Title>
                                    <Card.Text>{data?.totalSales || 'N/A'}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </>
                )}
                {role === 'seller' && (
                    <>
                        <Col md={6}>
                            <Card className="mb-4 shadow-sm">
                                <Card.Body>
                                    <Card.Title>Total Sales</Card.Title>
                                    <Card.Text>{data?.totalSales || 'N/A'}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6}>
                            <Card className="mb-4 shadow-sm">
                                <Card.Body>
                                    <Card.Title>Top-Selling Products</Card.Title>
                                    <Card.Text>{data?.topProducts?.join(', ') || 'N/A'}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </>
                )}
                {role === 'supplier' && (
                    <>
                        <Col md={6}>
                            <Card className="mb-4 shadow-sm">
                                <Card.Body>
                                    <Card.Title>Total Supplies</Card.Title>
                                    <Card.Text>{data?.totalSupplies || 'N/A'}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6}>
                            <Card className="mb-4 shadow-sm">
                                <Card.Body>
                                    <Card.Title>Pending Orders</Card.Title>
                                    <Card.Text>{data?.pendingOrders || 'N/A'}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </>
                )}
            </Row>
        </Container>
    );
};

export default Dashboard;