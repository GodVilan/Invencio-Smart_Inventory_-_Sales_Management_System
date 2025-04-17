import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../api';

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [show, setShow] = useState(false);
    const [currentCategory, setCurrentCategory] = useState({ name: '', description: '' });
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await fetchCategories();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        loadCategories();
    }, []);

    const handleSave = async () => {
        try {
            if (editing) {
                await updateCategory(currentCategory._id, currentCategory);
            } else {
                await createCategory(currentCategory);
            }
            setShow(false);
            setCurrentCategory({ name: '', description: '' });
            const data = await fetchCategories();
            setCategories(data);
        } catch (error) {
            console.error('Error saving category:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteCategory(id);
            setCategories(categories.filter((category) => category._id !== id));
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    return (
        <div>
            <Button onClick={() => { setShow(true); setEditing(false); }}>Add Category</Button>
            <Table striped bordered hover className="mt-4">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((category) => (
                        <tr key={category._id}>
                            <td>{category.name}</td>
                            <td>{category.description}</td>
                            <td>
                                <Button onClick={() => { setShow(true); setEditing(true); setCurrentCategory(category); }}>Edit</Button>
                                <Button variant="danger" onClick={() => handleDelete(category._id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{editing ? 'Edit Category' : 'Add Category'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={currentCategory.name}
                                onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                value={currentCategory.description}
                                onChange={(e) => setCurrentCategory({ ...currentCategory, description: e.target.value })}
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

export default CategoryManagement;