import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import UserManagement from '../components/UserManagement';
import ProductManagement from '../components/ProductManagement';
import SalesManagement from '../components/SalesManagement';
import SupplierManagement from '../components/SupplierManagement';

const AdminPage = () => {
    return (
        <Container className="mt-4">
            <h1 className="text-center mb-4">Admin Dashboard</h1>
            <Row>
                <Col md={6}>
                    <Card className="mb-4 shadow-sm">
                        <Card.Body>
                            <Card.Title>User Management</Card.Title>
                            <UserManagement />
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="mb-4 shadow-sm">
                        <Card.Body>
                            <Card.Title>Product Management</Card.Title>
                            <ProductManagement />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col md={6}>
                    <Card className="mb-4 shadow-sm">
                        <Card.Body>
                            <Card.Title>Sales Management</Card.Title>
                            <SalesManagement />
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="mb-4 shadow-sm">
                        <Card.Body>
                            <Card.Title>Supplier Management</Card.Title>
                            <SupplierManagement />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AdminPage;