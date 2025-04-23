import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';

const SupplierDashboard = ({ data }) => {
    const stats = data || {
        totalSupplies: 25,
        pendingOrders: 5
    };

    return (
        <Row className="gy-4">
            <Col md={6}>
                <Card className="h-100 shadow-sm border-0 rounded-4 bg-light-purple text-white">
                    <Card.Body>
                        <Card.Title className="fs-5 fw-semibold text-uppercase mb-3">Total Supplies</Card.Title>
                        <Card.Text className="display-6 fw-bold">{stats.totalSupplies}</Card.Text>
                        <p className="text-white-50 mb-0">Supplies handled successfully</p>
                    </Card.Body>
                </Card>
            </Col>

            <Col md={6}>
                <Card className="h-100 shadow-sm border-0 rounded-4 bg-light-orange text-white">
                    <Card.Body>
                        <Card.Title className="fs-5 fw-semibold text-uppercase mb-3">Pending Orders</Card.Title>
                        <Card.Text className="display-6 fw-bold">{stats.pendingOrders}</Card.Text>
                        <p className="text-white-50 mb-0">Orders waiting for fulfillment</p>
                    </Card.Body>
                </Card>
            </Col>

            <style>{`
                .bg-light-purple {
                    background-color: #7e5bef !important;
                }

                .bg-light-orange {
                    background-color: #ffa94d !important;
                }
            `}</style>
        </Row>
    );
};

export default SupplierDashboard;