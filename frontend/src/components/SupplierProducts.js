import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { fetchSupplierProducts } from '../api';

const SupplierProducts = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const data = await fetchSupplierProducts();
                setProducts(data);
            } catch (error) {
                console.error('Error fetching supplier products:', error);
            }
        };

        loadProducts();
    }, []);

    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Stock</th>
                </tr>
            </thead>
            <tbody>
                {products.map((product) => (
                    <tr key={product._id}>
                        <td>{product.name}</td>
                        <td>{product.description}</td>
                        <td>${product.price.toFixed(2)}</td>
                        <td>{product.stock}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default SupplierProducts;