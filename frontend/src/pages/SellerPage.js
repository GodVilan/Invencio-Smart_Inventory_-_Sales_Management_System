import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import ProductManagement from '../components/ProductManagement';
import SalesManagement from '../components/SalesManagement';

const SellerPage = () => {
    return (
        <Container className="mt-4">
            <h1 className="text-center mb-4">Seller Dashboard</h1>
            <Row>
                <Col md={6}>
                    <Card className="mb-4 shadow-sm">
                        <Card.Body>
                            <Card.Title>Product Management</Card.Title>
                            <p>View and manage the products available for sale.</p>
                            <ProductManagement apiEndpoint="/seller/products" /> {/* Seller-specific endpoint */}
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="mb-4 shadow-sm">
                        <Card.Body>
                            <Card.Title>Sales Management</Card.Title>
                            <p>Manage your sales records and track performance.</p>
                            <SalesManagement />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default SellerPage;