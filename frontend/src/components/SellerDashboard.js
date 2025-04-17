import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';

const SellerDashboard = ({ data }) => {
    return (
        <Row>
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
        </Row>
    );
};

export default SellerDashboard;