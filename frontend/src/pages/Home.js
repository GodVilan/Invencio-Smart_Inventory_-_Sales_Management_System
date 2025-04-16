import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div>
            {/* Navbar */}
            <nav style={styles.navbar}>
                <h1 style={styles.logo}>Invencio</h1>
                <div>
                    <Link to="/login" style={styles.navButton}>Login</Link>
                    <Link to="/register" style={styles.navButton}>Sign Up</Link>
                </div>
            </nav>

            {/* Main Content */}
            <div style={styles.container}>
                <h1>Welcome to Invencio</h1>
                <p>
                    Invencio is a modern, full-featured inventory control and sales management system designed to streamline product tracking, order processing, and inventory analysis for small to medium businesses.
                </p>
                <p>
                    With Invencio, you can manage products, suppliers, sales, and purchases seamlessly. It offers powerful reporting tools, dashboard insights, and user-friendly interfaces to help businesses stay ahead of stock issues, optimize supply chains, and make data-driven decisions with confidence.
                </p>
                <p>
                    Get started by logging in or signing up to explore the features of Invencio!
                </p>
            </div>
        </div>
    );
};

const styles = {
    navbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        backgroundColor: '#333',
        color: '#fff',
    },
    logo: {
        fontSize: '24px',
        fontWeight: 'bold',
    },
    navButton: {
        marginLeft: '10px',
        padding: '8px 15px',
        backgroundColor: '#007bff',
        color: '#fff',
        textDecoration: 'none',
        borderRadius: '5px',
    },
    container: {
        textAlign: 'center',
        padding: '50px 20px',
    },
};

export default Home;