import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';

const AdminDashboard = ({ data }) => {
    return (
        <Row>
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
        </Row>
    );
};

export default AdminDashboard;