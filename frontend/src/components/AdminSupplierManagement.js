import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Spinner, Alert } from 'react-bootstrap';
import { fetchSuppliers1, deleteSupplier, updateSupplier, createSupplier } from '../api';

const AdminSupplierManagement = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [currentSupplier, setCurrentSupplier] = useState(null); // For editing or creating a supplier

    useEffect(() => {
        const loadSuppliers = async () => {
            try {
                const data = await fetchSuppliers1();
                setSuppliers(data);
            } catch (error) {
                console.error('Error fetching suppliers:', error);
                setError('Failed to fetch suppliers.');
            } finally {
                setLoading(false);
            }
        };

        loadSuppliers();
    }, []);

    const handleDeleteSupplier = async (id) => {
        try {
            await deleteSupplier(id);
            setSuppliers(suppliers.filter((supplier) => supplier._id !== id));
        } catch (error) {
            console.error('Error deleting supplier:', error);
            setError('Failed to delete supplier.');
        }
    };

    const handleSaveSupplier = async () => {
        try {
            // Validate required fields
            if (!currentSupplier.name || !currentSupplier.email || !currentSupplier.phone || !currentSupplier.address) {
                setError('All fields (name, email, phone, address) are required.');
                return;
            }
    
            if (currentSupplier._id) {
                // Update existing supplier
                const updatedSupplier = await updateSupplier(currentSupplier._id, currentSupplier);
                setSuppliers(suppliers.map((supplier) => (supplier._id === updatedSupplier._id ? updatedSupplier : supplier)));
            } else {
                // Create new supplier
                const newSupplier = await createSupplier(currentSupplier);
                setSuppliers([...suppliers, newSupplier]);
            }
            setShowModal(false);
            setCurrentSupplier(null);
        } catch (error) {
            console.error('Error saving supplier:', error);
            setError('Failed to save supplier.');
        }
    };
    
    const handleEditSupplier = (supplier) => {
        setCurrentSupplier(supplier);
        setShowModal(true);
    };

    const handleAddSupplier = () => {
        setCurrentSupplier({ name: '', email: '', phone: '', address: '' });
        setShowModal(true);
    };

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
                <h3>Supplier Management</h3>
                <Button variant="primary" onClick={handleAddSupplier}>
                    Add Supplier
                </Button>
            </div>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {suppliers.map((supplier) => (
                        <tr key={supplier._id}>
                            <td>{supplier.name}</td>
                            <td>{supplier.email}</td>
                            <td>{supplier.phone}</td>
                            <td>{supplier.address}</td>
                            <td>
                                <Button
                                    variant="warning"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => handleEditSupplier(supplier)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleDeleteSupplier(supplier._id)}
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Add/Edit Supplier Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{currentSupplier?._id ? 'Edit Supplier' : 'Add Supplier'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={currentSupplier?.name || ''}
                                onChange={(e) => setCurrentSupplier({ ...currentSupplier, name: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={currentSupplier?.email || ''}
                                onChange={(e) => setCurrentSupplier({ ...currentSupplier, email: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control
                                type="text"
                                value={currentSupplier?.phone || ''}
                                onChange={(e) => setCurrentSupplier({ ...currentSupplier, phone: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                                type="text"
                                value={currentSupplier?.address || ''}
                                onChange={(e) => setCurrentSupplier({ ...currentSupplier, address: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSaveSupplier}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AdminSupplierManagement;