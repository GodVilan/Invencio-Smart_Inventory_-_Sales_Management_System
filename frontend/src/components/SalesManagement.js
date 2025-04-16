import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { fetchSales } from '../api';

const SalesManagement = () => {
    const [sales, setSales] = useState([]);

    useEffect(() => {
        const loadSales = async () => {
            try {
                const data = await fetchSales();
                setSales(data);
            } catch (error) {
                console.error('Error fetching sales:', error);
            }
        };
        loadSales();
    }, []);

    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                {sales.map((sale) => (
                    <tr key={sale._id}>
                        <td>{sale.productName}</td>
                        <td>{sale.quantity}</td>
                        <td>{sale.total}</td>
                        <td>{new Date(sale.date).toLocaleDateString()}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default SalesManagement;