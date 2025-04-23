import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Navbar, Nav, Button } from 'react-bootstrap';
import dashboardImage from '../images/dashboardImage.jpg';

const Home = () => {
    const isLoggedIn = !!sessionStorage.getItem('token'); // Check if the user is logged in

    return (
        <>
            {/* Navbar */}
            <Navbar expand="lg" className="bg-light shadow-sm px-4 py-2">
                <Container fluid>
                    <Navbar.Brand as={Link} to="/" className="fw-bold fs-3 text-purple">
                        Invencio
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                        <Nav>
                            {!isLoggedIn && (
                                <>
                                    <Nav.Link as={Link} to="/login" className="text-muted mx-2 hover-orange">
                                        Login
                                    </Nav.Link>
                                    <Nav.Link as={Link} to="/register" className="text-muted mx-2 hover-orange">
                                        Sign Up
                                    </Nav.Link>
                                </>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Hero Section with Dashboard Image */}
            <Container className="py-5">
                <Row className="align-items-center">
                    {/* Text Content */}
                    <Col lg={6}>
                        <h1 className="fw-bold mb-3 text-purple display-5">
                            Welcome to Invencio
                        </h1>
                        <h3 className="fw-bold mb-3 text-purple display-5">
                             Digital inventory planning system
                        </h3>
                        <p className="fs-5 text-muted mb-3">
                            Invencio empowers small and growing businesses with powerful tools to manage products,
                            suppliers, sales, and purchases seamlessly.
                        </p>
                        <p className="fs-5 text-muted mb-4">
                            Stay ahead of stock issues, optimize your supply chain, and make confident, data-driven decisions.
                        </p>
                        {!isLoggedIn && ( // Show the button only if the user is not logged in
                            <Link to="/register">
                                <Button variant="warning" className="px-4 py-2 rounded-3 fw-semibold">
                                    Get Started Free →
                                </Button>
                            </Link>
                        )}
                    </Col>

                    {/* Dashboard Preview Image */}
                    <Col lg={6} className="text-center mt-4 mt-lg-0">
                        <img
                            src={dashboardImage}
                            alt="Dashboard Preview"
                            className="img-fluid rounded shadow-sm"
                            style={{ maxHeight: '400px' }}
                        />
                    </Col>
                </Row>
            </Container>

            {/* Custom Styles */}
            <style>{`
                .text-purple {
                    color: #7e5bef !important;
                }

                .hover-orange:hover {
                    color: #ffa94d !important;
                    text-decoration: none;
                }

                .btn-warning {
                    background-color: #ffa94d;
                    border: none;
                }

                .btn-warning:hover {
                    background-color: #ff922b;
                }
            `}</style>
        </>
    );
};

export default Home;