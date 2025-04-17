import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import '../css/Navbar.css'; // Assuming you have some custom styles

const AppNavbar = ({ role, setRole }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.removeItem('token');
        setRole(null);
        navigate('/login');
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
            <Container>
                <Navbar.Brand as={Link} to="/dashboard">Invencio</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                        {role === 'admin' && (
                            <>
                                <Nav.Link as={Link} to="/admin/users">Users</Nav.Link>
                                <Nav.Link as={Link} to="/admin/products">Products</Nav.Link>
                                <Nav.Link as={Link} to="/admin/categories">Categories</Nav.Link>
                                <Nav.Link as={Link} to="/admin/brands">Brands</Nav.Link>
                                <Nav.Link as={Link} to="/admin/sales">Sales</Nav.Link>
                                <Nav.Link as={Link} to="/admin/suppliers">Suppliers</Nav.Link>
                            </>
                        )}
                    </Nav>
                    <Nav>
                        <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default AppNavbar;