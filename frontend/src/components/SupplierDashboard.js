import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';

const SupplierDashboard = ({ data }) => {
    // 👇 Fallback mock data if props are missing
    const stats = data || {
        totalSupplies: 25,
        pendingOrders: 5
    };

    return (
        <Row>
            <Col md={6}>
                <Card className="mb-4 shadow-sm border-primary">
                    <Card.Body>
                        <Card.Title>Total Supplies</Card.Title>
                        <Card.Text className="fs-4 text-success">
                            {stats.totalSupplies}
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Col>
            <Col md={6}>
                <Card className="mb-4 shadow-sm border-warning">
                    <Card.Body>
                        <Card.Title>Pending Orders</Card.Title>
                        <Card.Text className="fs-4 text-danger">
                            {stats.pendingOrders}
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default SupplierDashboard;