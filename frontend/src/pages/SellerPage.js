import React, { useState } from 'react';
import { Container, Row, Col, Card, Tab, Nav } from 'react-bootstrap';
import ProductList from '../components/ProductList';
import SalesManagement from '../components/SalesManagement';

const SellerPage = () => {
    const [activeTab, setActiveTab] = useState('products');

    return (
        <Container className="mt-4">
            <h1 className="text-center mb-4">Hello Seller!</h1>
            <Tab.Container activeKey={activeTab} onSelect={(key) => setActiveTab(key)}>
                <Row>
                    <Col md={3}>
                        <Nav variant="pills" className="flex-column">
                            <Nav.Item>
                                <Nav.Link eventKey="products">Product Listings</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="sales">Sales Management</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                    <Col md={9}>
                        <Tab.Content>
                            <Tab.Pane eventKey="products">
                                <Card className="mb-4 shadow-sm">
                                    <Card.Body>
                                        <Card.Title>Product Listings</Card.Title>
                                        <p>View and search for products available for sale.</p>
                                        <ProductList apiEndpoint="/seller/products" />
                                    </Card.Body>
                                </Card>
                            </Tab.Pane>
                            <Tab.Pane eventKey="sales">
                                <Card className="mb-4 shadow-sm">
                                    <Card.Body>
                                        <Card.Title>Sales Management</Card.Title>
                                        <p>Manage your sales records and track performance.</p>
                                        <SalesManagement />
                                    </Card.Body>
                                </Card>
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        </Container>
    );
};

export default SellerPage;