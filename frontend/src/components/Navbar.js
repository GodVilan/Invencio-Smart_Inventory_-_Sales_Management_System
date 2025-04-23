import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import profileIcon from '../images/profile.jpeg'; // Import the profile icon

const AppNavbar = ({ role, setRole }) => {
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);

    const handleLogout = () => {
        sessionStorage.removeItem('token');
        setRole(null);
        navigate('/login');
    };

    return (
        <>
            <Navbar expand="lg" sticky="top" className="bg-white shadow-sm px-3 py-2">
                <Container fluid>
                    <Navbar.Brand as={Link} to="/" className="fw-bold fs-4 text-purple">
                        Invencio
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/dashboard" className="text-muted nav-link-hover">
                                Dashboard
                            </Nav.Link>
                            {role === 'admin' && (
                                <>
                                    <Nav.Link as={Link} to="/admin/users" className="text-muted nav-link-hover">Users</Nav.Link>
                                    <Nav.Link as={Link} to="/admin/products" className="text-muted nav-link-hover">Products</Nav.Link>
                                    <Nav.Link as={Link} to="/admin/categories" className="text-muted nav-link-hover">Categories</Nav.Link>
                                    <Nav.Link as={Link} to="/admin/brands" className="text-muted nav-link-hover">Brands</Nav.Link>
                                    <Nav.Link as={Link} to="/admin/sales" className="text-muted nav-link-hover">Sales</Nav.Link>
                                    <Nav.Link as={Link} to="/admin/suppliers" className="text-muted nav-link-hover">Suppliers</Nav.Link>
                                </>
                            )}
                            {role === 'seller' && (
                                <>
                                    <Nav.Link as={Link} to="/seller">Sales Management</Nav.Link>
                                </>
                            )}
                        </Nav>
                        <Nav>
                            {/* Profile Dropdown */}
                            <Dropdown show={showDropdown} onToggle={(isOpen) => setShowDropdown(isOpen)}>
                                <Dropdown.Toggle as="div" className="d-flex align-items-center cursor-pointer">
                                    <img
                                        src={profileIcon}
                                        alt="Profile"
                                        className="rounded-circle"
                                        style={{ width: '40px', height: '40px', cursor: 'pointer' }}
                                    />
                                </Dropdown.Toggle>
                                <Dropdown.Menu align="end">
                                    <Dropdown.Item as={Link} to="/profile">Profile</Dropdown.Item>
                                    <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Custom Theme Classes */}
            <style>{`
                .text-purple {
                    color: #7e5bef !important;
                }

                .nav-link-hover:hover {
                    color: #ffa94d !important;
                }

                .cursor-pointer {
                    cursor: pointer;
                }
            `}</style>
        </>
    );
};

export default AppNavbar;