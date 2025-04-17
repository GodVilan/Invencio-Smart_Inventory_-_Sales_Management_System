import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Row, Col, Pagination, Modal } from 'react-bootstrap';
import { fetchFilteredProducts, deleteProduct, fetchCategories, fetchBrands, createProduct, updateProduct } from '../api';

const ProductManagement = ({ apiEndpoint }) => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [filters, setFilters] = useState({ name: '', category: '', brand: '', minPrice: '', maxPrice: '' });
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [currentProduct, setCurrentProduct] = useState({ name: '', category: '', brand: '', price: '', stock: '' });
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const data = await fetchFilteredProducts({ ...filters, page, apiEndpoint });
                setProducts(data.products);
                setTotalPages(data.pages);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        loadProducts();
    }, [filters, page, apiEndpoint]);

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
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
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
            const data = await fetchFilteredProducts({ ...filters, page, apiEndpoint });
            setProducts(data.products);
        } catch (error) {
            console.error('Error saving product:', error);
        }
    };

    return (
        <div>
            <Button className="mb-3" onClick={() => { setShowModal(true); setEditing(false); }}>
                Add Product
            </Button>
            <Form className="mb-4">
                <Row>
                    <Col>
                        <Form.Control
                            type="text"
                            name="name"
                            placeholder="Search by name"
                            value={filters.name}
                            onChange={handleFilterChange}
                        />
                    </Col>
                    <Col>
                        <Form.Select name="category" value={filters.category} onChange={handleFilterChange}>
                            <option value="">All Categories</option>
                            {categories.map((category) => (
                                <option key={category._id} value={category._id}>
                                    {category.name}
                                </option>
                            ))}
                        </Form.Select>
                    </Col>
                    <Col>
                        <Form.Select name="brand" value={filters.brand} onChange={handleFilterChange}>
                            <option value="">All Brands</option>
                            {brands.map((brand) => (
                                <option key={brand._id} value={brand._id}>
                                    {brand.name}
                                </option>
                            ))}
                        </Form.Select>
                    </Col>
                    <Col>
                        <Form.Control
                            type="number"
                            name="minPrice"
                            placeholder="Min price"
                            value={filters.minPrice}
                            onChange={handleFilterChange}
                        />
                    </Col>
                    <Col>
                        <Form.Control
                            type="number"
                            name="maxPrice"
                            placeholder="Max price"
                            value={filters.maxPrice}
                            onChange={handleFilterChange}
                        />
                    </Col>
                </Row>
            </Form>
            {/* Correctly Nest the Table */}
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Brand</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product._id}>
                            <td>
                                {product.image && (
                                    <img
                                        src={product.image} // Use Base64-encoded image
                                        alt={product.name}
                                        style={{ width: '50px', height: '50px' }}
                                    />
                                )}
                            </td>
                            <td>{product.name}</td>
                            <td>{product.category}</td>
                            <td>{product.brand}</td>
                            <td>{product.price}</td>
                            <td>{product.stock}</td>
                            <td>
                                <Button
                                    variant="warning"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => {
                                        setCurrentProduct(product);
                                        setEditing(true);
                                        setShowModal(true);
                                    }}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleDeleteProduct(product._id)}
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Pagination className="mt-4">
                {[...Array(totalPages).keys()].map((x) => (
                    <Pagination.Item
                        key={x + 1}
                        active={x + 1 === page}
                        onClick={() => handlePageChange(x + 1)}
                    >
                        {x + 1}
                    </Pagination.Item>
                ))}
            </Pagination>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{editing ? 'Edit Product' : 'Add Product'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
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
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSaveProduct}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ProductManagement;