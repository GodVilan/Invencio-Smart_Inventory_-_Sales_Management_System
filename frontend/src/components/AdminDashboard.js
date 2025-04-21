import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Table, Spinner, Alert, Button, Form } from 'react-bootstrap';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { fetchAdminDashboardData } from '../api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

const AdminDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [chartType, setChartType] = useState('line'); // Chart type filter (line or bar)

    // Fetch data for the last 30 days
    const fetchData = async () => {
        try {
            const dashboardData = await fetchAdminDashboardData();
            setData(dashboardData);
        } catch (error) {
            console.error('Error fetching admin dashboard data:', error);
            setError('Failed to load dashboard data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        // Set up live updates every minute
        const interval = setInterval(() => {
            fetchData();
        }, 60000); // 60 seconds

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, []);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
                <Alert variant="danger">{error}</Alert>
            </div>
        );
    }

    // Prepare data for the sales chart
    const salesChartData = {
        labels: data?.salesData?.map((entry) => entry.date) || [],
        datasets: [
            {
                label: 'Sales',
                data: data?.salesData?.map((entry) => entry.sales) || [],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: chartType === 'line' ? 'rgba(75, 192, 192, 0.2)' : 'rgba(75, 192, 192, 0.6)',
                tension: 0.4,
                fill: chartType === 'line', // Fill area below line for Line Chart
            },
        ],
    };

    // Prepare data for the revenue chart
    const revenueChartData = {
        labels: data?.salesData?.map((entry) => entry.date) || [],
        datasets: [
            {
                label: 'Revenue',
                data: data?.salesData?.map((entry) => entry.revenue) || [],
                borderColor: 'rgba(153, 102, 255, 1)',
                backgroundColor: chartType === 'line' ? 'rgba(153, 102, 255, 0.2)' : 'rgba(153, 102, 255, 0.6)',
                tension: 0.4,
                fill: chartType === 'line', // Fill area below line for Line Chart
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Sales and Revenue Trends (Last 30 Days)',
            },
        },
    };

    return (
        <div>
            <Row>
                <Col md={4}>
                    <Card className="mb-4 shadow-sm">
                        <Card.Body>
                            <Card.Title>Total Users</Card.Title>
                            <Card.Text>{data?.totalUsers || 'N/A'}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="mb-4 shadow-sm">
                        <Card.Body>
                            <Card.Title>Total Products</Card.Title>
                            <Card.Text>{data?.totalProducts || 'N/A'}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="mb-4 shadow-sm">
                        <Card.Body>
                            <Card.Title>Total Sales</Card.Title>
                            <Card.Text>{data?.totalSales || 'N/A'}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Chart Type Filter */}
            <Row>
                <Col md={12} className="mb-4">
                    <Form.Select
                        value={chartType}
                        onChange={(e) => setChartType(e.target.value)}
                        style={{ maxWidth: 'fit-content' }} // Adjust dropdown size
                    >
                        <option value="line">Line Chart</option>
                        <option value="bar">Bar Chart</option>
                    </Form.Select>
                </Col>
            </Row>

            {/* Sales and Revenue Charts Side by Side */}
            <Row>
                <Col md={6}>
                    <Card className="mb-4 shadow-sm">
                        <Card.Body>
                            {chartType === 'line' ? (
                                <Line data={salesChartData} options={{ ...chartOptions, title: { text: 'Sales Trends' } }} />
                            ) : (
                                <Bar data={salesChartData} options={{ ...chartOptions, title: { text: 'Sales Trends' } }} />
                            )}
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="mb-4 shadow-sm">
                        <Card.Body>
                            {chartType === 'line' ? (
                                <Line data={revenueChartData} options={{ ...chartOptions, title: { text: 'Revenue Trends' } }} />
                            ) : (
                                <Bar data={revenueChartData} options={{ ...chartOptions, title: { text: 'Revenue Trends' } }} />
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Low Inventory Alerts */}
            <Row>
                <Col md={12}>
                    <h3>Low Inventory Alerts</h3>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Stock</th>
                                <th>Reorder</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.lowInventory?.length > 0 ? (
                                data.lowInventory.map((product) => (
                                    <tr key={product._id}>
                                        <td>{product.name}</td>
                                        <td>{product.stock}</td>
                                        <td>
                                            <Button variant="primary" size="sm">
                                                Reorder
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="text-center">
                                        No low inventory alerts.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Col>
            </Row>

            {/* Stock Levels by Category */}
            <Row>
                <Col md={12}>
                    <h3>Stock Levels by Category</h3>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Stock Level</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.stockLevelsByCategory?.length > 0 ? (
                                data.stockLevelsByCategory.map((category) => (
                                    <tr key={category._id}>
                                        <td>{category.name}</td>
                                        <td>{category.stock}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="2" className="text-center">
                                        No data available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Col>
            </Row>

            {/* Top-Selling Products */}
            <Row>
                <Col md={12}>
                    <h3>Top-Selling Products</h3>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Sales</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.topSellingProducts?.length > 0 ? (
                                data.topSellingProducts.map((product) => (
                                    <tr key={product._id}>
                                        <td>{product.name}</td>
                                        <td>{product.sales}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="2" className="text-center">
                                        No data available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </div>
    );
};

export default AdminDashboard;