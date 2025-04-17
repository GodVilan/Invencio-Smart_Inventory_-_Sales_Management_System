import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Spinner, Alert } from 'react-bootstrap';
import AdminDashboard from './AdminDashboard';
import SellerDashboard from './SellerDashboard';
import SupplierDashboard from './SupplierDashboard';

const Dashboard = () => {
    const [role, setRole] = useState('');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRole = async () => {
            const token = sessionStorage.getItem('token');
            if (token) {
                try {
                    const response = await axios.get('http://localhost:5050/api/auth/me', {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setRole(response.data.role);
                } catch (error) {
                    setError('Failed to fetch user role.');
                }
            }
        };

        fetchRole();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (role) {
                try {
                    let response;
                    if (role === 'admin') {
                        response = await axios.get('http://localhost:5050/api/admin/dashboard');
                    } else if (role === 'seller') {
                        response = await axios.get('http://localhost:5050/api/seller/dashboard');
                    } else if (role === 'supplier') {
                        response = await axios.get('http://localhost:5050/api/supplier/dashboard');
                    }
                    setData(response.data);
                } catch (error) {
                    setError('Failed to fetch dashboard data.');
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchData();
    }, [role]);

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <Spinner animation="border" variant="primary" />
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <h1 className="text-center mb-4">{role.charAt(0).toUpperCase() + role.slice(1)} Dashboard</h1>
            {role === 'admin' && <AdminDashboard data={data} />}
            {role === 'seller' && <SellerDashboard data={data} />}
            {role === 'supplier' && <SupplierDashboard data={data} />}
        </Container>
    );
};

export default Dashboard;