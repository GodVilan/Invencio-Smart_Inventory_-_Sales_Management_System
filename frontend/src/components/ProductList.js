import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Row, Col, Spinner, Alert, Form, InputGroup, FormControl } from 'react-bootstrap';
import { fetchFilteredProducts, fetchCategories, fetchBrands } from '../api';

const ProductList = ({ apiEndpoint }) => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null); // For the modal
    const [filters, setFilters] = useState({ name: '', category: '', brand: '', minPrice: '', maxPrice: '' });

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const data = await fetchFilteredProducts({ ...filters, apiEndpoint });
                setProducts(data.products);
            } catch (error) {
                setError('Failed to load products.');
            } finally {
                setLoading(false);
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

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
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

            {/* Product Cards */}
            <Row>
                {products.map((product) => (
                    <Col md={4} key={product._id} className="mb-4">
                        <Card className="shadow-sm">
                            <Card.Img
                                variant="top"
                                src={product.image || 'https://via.placeholder.com/150'}
                                alt={product.name}
                                style={{ height: '200px', objectFit: 'cover' }}
                            />
                            <Card.Body>
                                <Card.Title>{product.name}</Card.Title>
                                <Card.Text>
                                    <strong>Price:</strong> ${product.price.toFixed(2)}
                                </Card.Text>
                                <Card.Text>
                                    <strong>Stock:</strong> {product.stock}
                                </Card.Text>
                                <Button
                                    variant="link"
                                    className="p-0"
                                    onClick={() => setSelectedProduct(product)}
                                >
                                    View
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Product Details Modal */}
            {selectedProduct && (
                <Modal
                    show={!!selectedProduct}
                    onHide={() => setSelectedProduct(null)}
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title>{selectedProduct.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col md={6}>
                                <img
                                    src={selectedProduct.image || 'https://via.placeholder.com/150'}
                                    alt={selectedProduct.name}
                                    className="img-fluid mb-3"
                                />
                            </Col>
                            <Col md={6}>
                                <p><strong>Price:</strong> ${selectedProduct.price.toFixed(2)}</p>
                                <p><strong>Stock:</strong> {selectedProduct.stock}</p>
                                <p><strong>Category:</strong> {selectedProduct.category?.name || 'N/A'}</p>
                                <p><strong>Brand:</strong> {selectedProduct.brand?.name || 'N/A'}</p>
                            </Col>
                        </Row>
                        <hr />
                        <div>
                            <h5>Description</h5>
                            <p>{selectedProduct.description || 'No description available.'}</p>
                        </div>
                        <hr />
                        <div>
                            <h5>Additional Details</h5>
                            <ul>
                                <li><strong>SKU:</strong> {selectedProduct.sku || 'N/A'}</li>
                                <li><strong>Weight:</strong> {selectedProduct.weight || 'N/A'} kg</li>
                                <li><strong>Dimensions:</strong> {selectedProduct.dimensions || 'N/A'}</li>
                            </ul>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setSelectedProduct(null)}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
};

export default ProductList;