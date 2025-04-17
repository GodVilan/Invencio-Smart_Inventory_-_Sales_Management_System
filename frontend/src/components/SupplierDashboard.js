import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';

const SupplierDashboard = ({ data }) => {
    return (
        <Row>
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
        </Row>
    );
};

export default SupplierDashboard;