import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Row, Col, Modal, InputGroup, FormControl, Container } from 'react-bootstrap';
import { fetchFilteredProducts, deleteProduct, fetchCategories, fetchBrands, createProduct, updateProduct } from '../api';

const ProductManagement = ({ apiEndpoint }) => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [filters, setFilters] = useState({ name: '', category: '', brand: '', minPrice: '', maxPrice: '' });
    const [showModal, setShowModal] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const data = await fetchFilteredProducts({ ...filters, apiEndpoint });
                setProducts(data.products);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        loadProducts();
    }, [filters, apiEndpoint]);

    useEffect(() => {
        const loadCategoriesAndBrands = async () => {
            try {
                const [categoryData, brandData] = await Promise.all([fetchCategories(), fetchBrands()]);
                setCategories(categoryData);
                setBrands(brandData);
            } catch (error) {
                console.error('Error fetching categories or brands:', error);
            }
        };
        loadCategoriesAndBrands();
    }, []);

    const handleDeleteProduct = async (id) => {
        try {
            await deleteProduct(id);
            setProducts(products.filter((product) => product._id !== id));
            setShowModal(false);
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleSaveProduct = async () => {
        try {
            let base64Image = currentProduct.image;
    
            // Convert the image file to Base64 if it's a File object
            if (currentProduct.image instanceof File) {
                base64Image = await convertToBase64(currentProduct.image);
            }
    
            const productData = {
                ...currentProduct,
                image: base64Image, // Send Base64-encoded image
            };
    
            if (editing) {
                await updateProduct(currentProduct._id, productData);
            } else {
                await createProduct(productData);
            }
    
            setShowModal(false);
            setCurrentProduct({ name: '', category: '', brand: '', price: '', stock: '', image: '' });
            const data = await fetchFilteredProducts({ ...filters, apiEndpoint });
            setProducts(data.products);
        } catch (error) {
            console.error('Error saving product:', error);
        }
    };

    return (
        <Container>
            <h1 className="text-center my-4">Product Management</h1>

            {/* Filters Section */}
            <Form className="mb-4">
                <Row className="align-items-end">
                    <Col md={3}>
                        <Form.Control
                            type="text"
                            name="name"
                            placeholder="Search by name"
                            value={filters.name}
                            onChange={handleFilterChange}
                        />
                    </Col>
                    <Col md={3}>
                        <Form.Select name="category" value={filters.category} onChange={handleFilterChange}>
                            <option value="">All Categories</option>
                            {categories.map((category) => (
                                <option key={category._id} value={category._id}>
                                    {category.name}
                                </option>
                            ))}
                        </Form.Select>
                    </Col>
                    <Col md={3}>
                        <Form.Select name="brand" value={filters.brand} onChange={handleFilterChange}>
                            <option value="">All Brands</option>
                            {brands.map((brand) => (
                                <option key={brand._id} value={brand._id}>
                                    {brand.name}
                                </option>
                            ))}
                        </Form.Select>
                    </Col>
                    <Col md={3}>
                        <InputGroup>
                            <FormControl
                                type="number"
                                name="minPrice"
                                placeholder="Min price"
                                value={filters.minPrice}
                                onChange={handleFilterChange}
                            />
                            <FormControl
                                type="number"
                                name="maxPrice"
                                placeholder="Max price"
                                value={filters.maxPrice}
                                onChange={handleFilterChange}
                            />
                        </InputGroup>
                    </Col>
                </Row>
            </Form>

            <Button
                className="mb-4"
                onClick={() => {
                    setCurrentProduct({ name: '', description: '', category: '', brand: '', price: '', stock: '', image: '' });
                    setEditing(false);
                    setShowModal(true);
                }}
            >
                Add Product
            </Button>

            {/* Product Cards */}
            <Row>
                {products.map((product) => (
                    <Col md={4} sm={6} xs={12} className="mb-4" key={product._id}>
                        <Card className="shadow-sm h-100">
                            <Card.Img
                                variant="top"
                                src={product.image}
                                alt={product.name}
                                style={{ height: '200px', objectFit: 'cover' }}
                            />
                            <Card.Body>
                                <Card.Title>{product.name}</Card.Title>
                                <Card.Text>
                                    <strong>Price:</strong> ${product.price} <br />
                                    <strong>Category:</strong> {product.category?.name || 'N/A'} <br />
                                    <strong>Brand:</strong> {product.brand?.name || 'N/A'}
                                </Card.Text>
                                <div className="d-flex justify-content-end">
                                    <Button
                                        variant="link"
                                        onClick={() => {
                                            setCurrentProduct(product);
                                            setEditing(false); // Ensure it's in view mode
                                            setShowModal(true);
                                        }}
                                    >
                                        View
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* View/Add/Edit Product Modal */}
                {currentProduct && (
                    <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>
                                {editing ? 'Edit Product' : currentProduct._id ? 'Product Details' : 'Add Product'}
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {editing || !currentProduct._id ? (
                                // Add/Edit Form
                                <Form>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={currentProduct.name}
                                            onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Description</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            value={currentProduct.description}
                                            onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Category</Form.Label>
                                        <Form.Select
                                            value={currentProduct.category}
                                            onChange={(e) => setCurrentProduct({ ...currentProduct, category: e.target.value })}
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map((category) => (
                                                <option key={category._id} value={category._id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Brand</Form.Label>
                                        <Form.Select
                                            value={currentProduct.brand}
                                            onChange={(e) => setCurrentProduct({ ...currentProduct, brand: e.target.value })}
                                        >
                                            <option value="">Select Brand</option>
                                            {brands.map((brand) => (
                                                <option key={brand._id} value={brand._id}>
                                                    {brand.name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Price</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={currentProduct.price}
                                            onChange={(e) => setCurrentProduct({ ...currentProduct, price: e.target.value })}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Stock</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={currentProduct.stock}
                                            onChange={(e) => setCurrentProduct({ ...currentProduct, stock: e.target.value })}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Image</Form.Label>
                                        <Form.Control
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setCurrentProduct({ ...currentProduct, image: e.target.files[0] })}
                                        />
                                    </Form.Group>
                                </Form>
                            ) : (
                                // View Mode
                                <>
                                    <div className="text-center">
                                        <img
                                            src={currentProduct.image}
                                            alt={currentProduct.name}
                                            style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain', marginBottom: '20px' }}
                                        />
                                        <h3 className="mt-3">{currentProduct.name}</h3>
                                    </div>
                                    <hr />
                                    <p>
                                        <strong>Description:</strong>{' '}
                                        {currentProduct.description ? (
                                            currentProduct.description.split('\n').map((line, index) => (
                                                <span key={index}>
                                                    {line}
                                                    <br />
                                                </span>
                                            ))
                                        ) : (
                                            'N/A'
                                        )}
                                    </p>
                                    <p>
                                        <strong>Price:</strong> ${currentProduct.price}
                                    </p>
                                    <p>
                                        <strong>Category:</strong> {currentProduct.category?.name || 'N/A'}
                                    </p>
                                    <p>
                                        <strong>Brand:</strong> {currentProduct.brand?.name || 'N/A'}
                                    </p>
                                    <p>
                                        <strong>Stock:</strong> {currentProduct.stock}
                                    </p>
                                </>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            {editing || !currentProduct._id ? (
                                <Button variant="primary" onClick={handleSaveProduct}>
                                    Save
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        variant="danger"
                                        onClick={() => handleDeleteProduct(currentProduct._id)}
                                    >
                                        Delete
                                    </Button>
                                    <Button
                                        variant="warning"
                                        onClick={() => {
                                            setEditing(true); // Switch to edit mode
                                            setShowModal(true); // Ensure the modal remains open
                                        }}
                                    >
                                        Edit
                                    </Button>
                                </>
                            )}
                        </Modal.Footer>
                    </Modal>
                )}
        </Container>
    );
};

export default ProductManagement;