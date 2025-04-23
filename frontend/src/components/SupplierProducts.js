import React, { useState, useEffect } from 'react';
import { Table, Card, Spinner, Alert } from 'react-bootstrap';
import { fetchSupplierProducts } from '../api';

const SupplierProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const data = await fetchSupplierProducts();
                setProducts(data);
            } catch (error) {
                console.error('Error fetching supplier products:', error);
                setError('Failed to load supplier products.');
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    if (loading) {
        return <Spinner animation="border" className="d-block mx-auto my-5" />;
    }

    return (
        <Card className="shadow-sm rounded-4 border-0 mt-4">
            <Card.Body>
                <Card.Title className="text-purple fw-bold mb-4">📦 My Supplied Products</Card.Title>

                {error && <Alert variant="danger">{error}</Alert>}

                <Table striped bordered hover responsive>
                    <thead className="table-light">
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Stock</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length > 0 ? (
                            products.map((product) => (
                                <tr key={product._id}>
                                    <td>{product.name}</td>
                                    <td>{product.description}</td>
                                    <td>${product.price.toFixed(2)}</td>
                                    <td>{product.stock}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center text-muted py-3">
                                    No products found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Card.Body>

            <style>{`
                .text-purple {
                    color: #7e5bef;
                }
            `}</style>
        </Card>
    );
};

export default SupplierProducts;