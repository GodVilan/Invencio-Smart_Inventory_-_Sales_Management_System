import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Spinner, Alert, Image } from 'react-bootstrap';
import { fetchSales, createSale, deleteSale, updateSale, fetchProducts, fetchSalesReport } from '../api';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const AdminSalesManagement = () => {
    const [sales, setSales] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [currentSale, setCurrentSale] = useState(null); // For editing or creating a sale
    const [filter, setFilter] = useState('all');
    const [report, setReport] = useState(null); // For storing the sales report

    useEffect(() => {
        const loadSalesAndProducts = async () => {
            try {
                const [salesData, productsData] = await Promise.all([fetchSales(), fetchProducts()]);
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
            await deleteSale(id);
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
                const updatedSale = await updateSale(currentSale._id, currentSale);
                setSales(sales.map((sale) => (sale._id === updatedSale._id ? updatedSale : sale)));
            } else {
                // Create new sale
                const newSale = await createSale(currentSale);
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

    const handleGenerateReport = async () => {
        try {
            const reportData = await fetchSalesReport();
            setReport(reportData);

            // Generate PDF
            const doc = new jsPDF();
            
            console.log("Type");
            console.log(typeof doc.autoTable); // Should log "function"
            
            doc.text('Admin Sales Report', 14, 10);
            doc.autoTable({
                head: [['Period', 'Total Sales', 'Total Quantity']],
                body: reportData.map((entry) => [
                    entry._id,
                    `$${entry.totalSales.toFixed(2)}`,
                    entry.totalQuantity,
                ]),
            });

            // Save the PDF
            doc.save('Admin_Sales_Report.pdf');
        } catch (error) {
            console.error('Error generating sales report:', error);
            setError('Failed to generate sales report.');
        }
    };

    const handleQuantityChange = (quantity) => {
        // Resolve the product based on the productId in currentSale
        const product = products.find((p) => 
            p._id === (typeof currentSale.productId === 'object' ? currentSale.productId._id : currentSale.productId)
        );
    
        const price = product ? product.price : 0; // Get the price of the product
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
                <div>
                    <Button variant="primary" className="me-2" onClick={handleAddSale}>
                        Add Sale
                    </Button>
                    <Button variant="success" onClick={handleGenerateReport}>
                        Generate Report
                    </Button>
                </div>
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
                            <td>
                                {sale.productId?.image ? (
                                    <Image
                                        src={sale.productId.image}
                                        alt={sale.productId.name}
                                        thumbnail
                                        width={50}
                                        className="mb-2"
                                    />
                                ) : (
                                    'No Image'
                                )}
                                <div>{sale.productId?.name || 'N/A'}</div>
                            </td>
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

export default AdminSalesManagement;