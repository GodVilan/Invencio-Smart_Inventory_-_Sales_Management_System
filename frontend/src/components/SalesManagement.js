import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Spinner, Alert } from 'react-bootstrap';
import { fetchSales2, createSale2, updateSale2, deleteSale2, fetchProducts2 } from '../api';

const SalesManagement = () => {
    const [sales, setSales] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [currentSale, setCurrentSale] = useState(null); // For editing or creating a sale
    const [filter, setFilter] = useState('all'); // Filter for sales (daily, weekly, etc.)

    useEffect(() => {
        const loadSalesAndProducts = async () => {
            try {
                const [salesData, productsData] = await Promise.all([fetchSales2(), fetchProducts2()]);
                setSales(salesData);
                setProducts(productsData);
            } catch (error) {
                console.error('Error loading sales or products:', error);
                setError('Failed to load sales or products.');
            } finally {
                setLoading(false);
            }
        };

        loadSalesAndProducts();
    }, []);

    const handleDeleteSale = async (id) => {
        try {
            await deleteSale2(id);
            setSales(sales.filter((sale) => sale._id !== id));
        } catch (error) {
            console.error('Error deleting sale:', error);
            setError('Failed to delete sale.');
        }
    };

    const handleSaveSale = async () => {
        try {
            if (currentSale._id) {
                // Update existing sale
                const updatedSale = await updateSale2(currentSale._id, currentSale);
                setSales(sales.map((sale) => (sale._id === updatedSale._id ? updatedSale : sale)));
            } else {
                // Create new sale
                const newSale = await createSale2(currentSale);
                setSales([...sales, newSale]);
            }
            setShowModal(false);
            setCurrentSale(null);
        } catch (error) {
            console.error('Error saving sale:', error);
            setError('Failed to save sale.');
        }
    };

    const handleAddSale = () => {
        setCurrentSale({ productId: '', quantity: '', totalAmount: '' });
        setShowModal(true);
    };

    const handleEditSale = (sale) => {
        setCurrentSale(sale);
        setShowModal(true);
    };

    const handleQuantityChange = (quantity) => {
        const product = products.find((p) => p._id === currentSale.productId);
        const price = product ? product.price : 0;
        setCurrentSale({ ...currentSale, quantity, totalAmount: quantity * price });
    };

    const filteredSales = sales.filter((sale) => {
        const saleDate = new Date(sale.date);
        const now = new Date();

        if (filter === 'daily') {
            return saleDate.toDateString() === now.toDateString();
        } else if (filter === 'weekly') {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(now.getDate() - 7);
            return saleDate >= oneWeekAgo;
        } else if (filter === 'monthly') {
            return saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear();
        } else if (filter === 'yearly') {
            return saleDate.getFullYear() === now.getFullYear();
        }
        return true; // 'all'
    });

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>Sales Management</h3>
                <Button variant="primary" onClick={handleAddSale}>
                    Add Sale
                </Button>
            </div>

            <Form.Select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="mb-3"
            >
                <option value="all">All</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
            </Form.Select>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Total Amount</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredSales.map((sale) => (
                        <tr key={sale._id}>
                            <td>{sale.productId?.name || 'N/A'}</td>
                            <td>{sale.quantity}</td>
                            <td>${sale.totalAmount.toFixed(2)}</td>
                            <td>{new Date(sale.date).toLocaleDateString()}</td>
                            <td>
                                <Button
                                    variant="warning"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => handleEditSale(sale)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleDeleteSale(sale._id)}
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Add/Edit Sale Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{currentSale?._id ? 'Edit Sale' : 'Add Sale'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Product</Form.Label>
                            <Form.Select
                                value={currentSale?.productId || ''}
                                onChange={(e) => setCurrentSale({ ...currentSale, productId: e.target.value })}
                            >
                                <option value="">Select Product</option>
                                {products.map((product) => (
                                    <option key={product._id} value={product._id}>
                                        {product.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Quantity</Form.Label>
                            <Form.Control
                                type="number"
                                value={currentSale?.quantity || ''}
                                onChange={(e) => handleQuantityChange(Number(e.target.value))}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Total Amount</Form.Label>
                            <Form.Control
                                type="number"
                                value={currentSale?.totalAmount || ''}
                                readOnly
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSaveSale}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default SalesManagement;