import React, { useEffect, useState } from 'react';
import { Spinner, Alert, Table } from 'react-bootstrap';
import { fetchSupplierAnalytics } from '../api';

const SupplierAnalytics = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadAnalytics = async () => {
            try {
                const data = await fetchSupplierAnalytics();
                setAnalytics(data);
            } catch (error) {
                setError('Failed to fetch analytics data.');
            } finally {
                setLoading(false);
            }
        };

        loadAnalytics();
    }, []);

    if (loading) {
        return <Spinner animation="border" className="d-block mx-auto" />;
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    return (
        <div>
            <h3>Monthly Supplies</h3>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Month</th>
                        <th>Total Supplies</th>
                    </tr>
                </thead>
                <tbody>
                    {analytics.monthlySupplies.map((supply) => (
                        <tr key={supply._id}>
                            <td>{supply._id}</td>
                            <td>{supply.total}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <h3>Top Products</h3>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Product ID</th>
                        <th>Count</th>
                    </tr>
                </thead>
                <tbody>
                    {analytics.topProducts.map((product) => (
                        <tr key={product._id}>
                            <td>{product._id}</td>
                            <td>{product.count}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default SupplierAnalytics;