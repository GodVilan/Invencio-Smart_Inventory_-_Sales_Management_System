import React, { useEffect, useState } from 'react';
import { Container, Button, ButtonGroup, Spinner, Alert } from 'react-bootstrap';
import SupplierDashboard from '../components/SupplierDashboard';
import SupplierProfile from '../components/SupplierProfile';
import SupplierProducts from '../components/SupplierProducts';
import SupplierAnalytics from '../components/SupplierAnalytics';
import { fetchSupplierDashboardData } from '../api';

const SupplierPage = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const data = await fetchSupplierDashboardData();
                setDashboardData(data.stats);
            } catch (err) {
                console.warn('⚠ Backend not responding. Using mock dashboard data.');
                setDashboardData({
                    totalSupplies: 15,
                    pendingOrders: 3,
                });
                setError('Backend not available — showing mock data');
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    return (
        <Container className="mt-4">
            <h2 className="text-center fw-bold mb-4 text-purple">Supplier Portal</h2>

            {error && (
                <Alert variant="warning" className="text-center">
                    {error}
                </Alert>
            )}

            {/* Navigation buttons */}
            <div className="d-flex justify-content-center mb-4">
                <ButtonGroup>
                    {['dashboard', 'management', 'profile', 'analytics'].map((tab) => (
                        <Button
                            key={tab}
                            variant={activeTab === tab ? 'primary' : 'outline-primary'}
                            className="text-capitalize"
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </Button>
                    ))}
                </ButtonGroup>
            </div>

            {/* Section display */}
            {loading && (
                <div className="d-flex justify-content-center">
                    <Spinner animation="border" variant="primary" />
                </div>
            )}

            {!loading && dashboardData && (
                <>
                    {activeTab === 'dashboard' && <SupplierDashboard data={dashboardData} />}
                    {activeTab === 'profile' && <SupplierProfile />}
                    {activeTab === 'management' && <SupplierProducts />}
                    {activeTab === 'analytics' && <SupplierAnalytics />}
                </>
            )}

            <style>{`
                .text-purple {
                    color: #7e5bef;
                }
            `}</style>
        </Container>
    );
};

export default SupplierPage;