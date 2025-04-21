import React, { useEffect, useState } from 'react';
import { fetchSellerDashboardData } from '../api';

const SellerDashboard = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const dashboardData = await fetchSellerDashboardData();
                setData(dashboardData);
            } catch (error) {
                console.error('Error loading dashboard data:', error);
            }
        };

        loadData();
    }, []);

    if (!data) return <div>Loading...</div>;

    return (
        <div>
            <h3>Seller Dashboard</h3>
            <p>Total Sales: {data.totalSales || 0}</p> {/* Fallback to 0 */}
            <p>Total Revenue: ${data.totalRevenue?.toFixed(2) || '0.00'}</p> {/* Fallback to 0.00 */}
            <h4>Top-Selling Products</h4>
            <ul>
                {data.topSellingProducts.length > 0 ? (
                    data.topSellingProducts.map((product, index) => (
                        <li key={index}>
                            {product.name} - {product.sales} units sold
                        </li>
                    ))
                ) : (
                    <li>No top-selling products available</li>
                )}
            </ul>
        </div>
    );
};

export default SellerDashboard;