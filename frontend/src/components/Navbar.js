import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';

const AppNavbar = ({ role, setRole }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.removeItem('token'); // Clear sessionStorage
        setRole(null); // Clear role in App.js
        navigate('/login'); // Redirect to login page
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
            <Container>
                <Navbar.Brand as={Link} to="/">
                    Invencio
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                        {role === 'admin' && <Nav.Link as={Link} to="/admin">Admin</Nav.Link>}
                        {role === 'seller' && <Nav.Link as={Link} to="/seller">Seller</Nav.Link>}
                        {role === 'supplier' && <Nav.Link as={Link} to="/supplier">Supplier</Nav.Link>}
                    </Nav>
                    <Nav>
                        <NavDropdown title="Account" id="account-dropdown" align="end">
                            <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default AppNavbar;