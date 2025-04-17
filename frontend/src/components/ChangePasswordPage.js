import React from 'react';
import { Container, Card } from 'react-bootstrap';
import ChangePassword from '../components/ChangePassword';

const ChangePasswordPage = () => {
    return (
        <Container className="mt-4">
            <Card className="shadow-lg">
                <Card.Body>
                    <h2 className="text-center mb-4">Change Password</h2>
                    <ChangePassword />
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ChangePasswordPage;