import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import { fetchBrands, createBrand, updateBrand, deleteBrand } from '../api';

const BrandManagement = () => {
    const [brands, setBrands] = useState([]);
    const [show, setShow] = useState(false);
    const [currentBrand, setCurrentBrand] = useState({ name: '', description: '' });
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        const loadBrands = async () => {
            try {
                const data = await fetchBrands();
                setBrands(data);
            } catch (error) {
                console.error('Error fetching brands:', error);
            }
        };
        loadBrands();
    }, []);

    const handleSave = async () => {
        try {
            if (editing) {
                await updateBrand(currentBrand._id, currentBrand);
            } else {
                await createBrand(currentBrand);
            }
            setShow(false);
            setCurrentBrand({ name: '', description: '' });
            const data = await fetchBrands();
            setBrands(data);
        } catch (error) {
            console.error('Error saving brand:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteBrand(id);
            setBrands(brands.filter((brand) => brand._id !== id));
        } catch (error) {
            console.error('Error deleting brand:', error);
        }
    };

    return (
        <div>
            <Button onClick={() => { setShow(true); setEditing(false); }}>Add Brand</Button>
            <Table striped bordered hover className="mt-4">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {brands.map((brand) => (
                        <tr key={brand._id}>
                            <td>{brand.name}</td>
                            <td>{brand.description}</td>
                            <td>
                                <Button onClick={() => { setShow(true); setEditing(true); setCurrentBrand(brand); }}>Edit</Button>
                                <Button variant="danger" onClick={() => handleDelete(brand._id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{editing ? 'Edit Brand' : 'Add Brand'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={currentBrand.name}
                                onChange={(e) => setCurrentBrand({ ...currentBrand, name: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                value={currentBrand.description}
                                onChange={(e) => setCurrentBrand({ ...currentBrand, description: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>Close</Button>
                    <Button variant="primary" onClick={handleSave}>Save</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};


export default BrandManagement;