import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import SupplierManagement from '../components/SupplierManagement';

const SupplierPage = () => {
    return (
        <Container className="mt-4">
            <h1 className="text-center mb-4">Supplier Dashboard</h1>
            <Row>
                <Col md={12}>
                    <Card className="mb-4 shadow-sm">
                        <Card.Body>
                            <Card.Title>Supplier Management</Card.Title>
                            <p>View and manage supplier-related data and procurement processes.</p>
                            <SupplierManagement />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default SupplierPage;