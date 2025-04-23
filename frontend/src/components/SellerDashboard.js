import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Spinner, Alert, Form } from 'react-bootstrap';
import { Bar, Line } from 'react-chartjs-2';
import { fetchSellerDashboardData } from '../api';

const SellerDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [chartType, setChartType] = useState('line'); // Chart type filter (line or bar)

    useEffect(() => {
        const loadData = async () => {
            try {
                const dashboardData = await fetchSellerDashboardData();
                setData(dashboardData);
            } catch (error) {
                setError('Failed to load dashboard data.');
            } finally {
                setLoading(false);
            }
        };

        loadData();
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

    // const chartOptions = {
    //     responsive: true,
    //     plugins: {
    //         legend: {
    //             position: 'top',
    //         },
    //         title: {
    //             display: true,
    //             text: 'Sales and Revenue Trends (Last 30 Days)',
    //         },
    //     },
    // };

    return (
        <div>
            <Row>
                <Col md={4}>
                    <Card className="mb-4 shadow-sm">
                        <Card.Body>
                            <Card.Title>Total Sales</Card.Title>
                            <Card.Text>{data?.totalSales || 'N/A'}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="mb-4 shadow-sm">
                        <Card.Body>
                            <Card.Title>Total Revenue</Card.Title>
                            <Card.Text>${data?.totalRevenue?.toFixed(2) || 'N/A'}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="mb-4 shadow-sm">
                        <Card.Body>
                            <Card.Title>Top-Selling Products</Card.Title>
                            <ul>
                                {data?.topSellingProducts?.length > 0 ? (
                                    data.topSellingProducts.map((product, index) => (
                                        <li key={index}>
                                            {product.name} - {product.sales} units sold
                                        </li>
                                    ))
                                ) : (
                                    <li>No top-selling products available</li>
                                )}
                            </ul>
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
                        style={{ maxWidth: 'fit-content' }}
                    >
                        <option value="line">Line Chart</option>
                        <option value="bar">Bar Chart</option>
                    </Form.Select>
                </Col>
            </Row>

            {/* Sales and Revenue Charts */}
            <Row>
                <Col md={6}>
                    <Card className="mb-4 shadow-sm">
                        <Card.Body>
                            {chartType === 'line' ? (
                                <Line data={salesChartData} />
                            ) : (
                                <Bar data={salesChartData} />
                            )}
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="mb-4 shadow-sm">
                        <Card.Body>
                            {chartType === 'line' ? (
                                <Line data={revenueChartData} />
                            ) : (
                                <Bar data={revenueChartData} />
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default SellerDashboard;