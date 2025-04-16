import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import { fetchSuppliers, deleteSupplier } from '../api';

const SupplierManagement = () => {
    const [suppliers, setSuppliers] = useState([]);

    useEffect(() => {
        const loadSuppliers = async () => {
            try {
                const data = await fetchSuppliers();
                setSuppliers(data);
            } catch (error) {
                console.error('Error fetching suppliers:', error);
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
        }
    };

    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Contact</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {suppliers.map((supplier) => (
                    <tr key={supplier._id}>
                        <td>{supplier.name}</td>
                        <td>{supplier.contact}</td>
                        <td>
                            <Button variant="warning" size="sm" className="me-2">
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
    );
};

export default SupplierManagement;