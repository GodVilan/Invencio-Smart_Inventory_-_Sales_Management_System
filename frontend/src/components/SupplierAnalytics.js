import React, { useEffect, useState } from 'react';
import { Spinner, Alert, Table, Row, Col, Card } from 'react-bootstrap';
import { fetchSupplierAnalytics } from '../api';

const SupplierAnalytics = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadAnalytics = async () => {
            try {
                const data = await fetchSupplierAnalytics();
                setAnalytics(data);
            } catch (error) {
                setError('Failed to fetch analytics data.');
            } finally {
                setLoading(false);
            }
        };

        loadAnalytics();
    }, []);

    if (loading) {
        return <Spinner animation="border" className="d-block mx-auto my-5" />;
    }

    if (error) {
        return <Alert variant="danger" className="my-4 text-center">{error}</Alert>;
    }

    return (
        <div className="my-4">
            <Row className="gy-4">
                <Col md={6}>
                    <Card className="shadow-sm rounded-4 border-0">
                        <Card.Body>
                            <Card.Title className="text-purple fw-bold mb-3">📆 Monthly Supplies</Card.Title>
                            <Table responsive bordered hover className="mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Month</th>
                                        <th>Total Supplies</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {analytics.monthlySupplies.map((supply) => (
                                        <tr key={supply._id}>
                                            <td>{getMonthName(supply._id)}</td>
                                            <td>{supply.total}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6}>
                    <Card className="shadow-sm rounded-4 border-0">
                        <Card.Body>
                            <Card.Title className="text-purple fw-bold mb-3">🏆 Top Supplied Products</Card.Title>
                            <Table responsive bordered hover className="mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Product</th>
                                        <th>Count</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {analytics.topProducts.map((product) => (
                                        <tr key={product._id}>
                                            <td>{product._id}</td>
                                            <td>{product.count}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <style>{`
                .text-purple {
                    color: #7e5bef;
                }
            `}</style>
        </div>
    );
};

// Helper function to convert month number to month name
const getMonthName = (num) => {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[num - 1] || 'Unknown';
};

export default SupplierAnalytics;