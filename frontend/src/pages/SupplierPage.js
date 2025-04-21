import React, { useEffect, useState } from 'react';
import { Container, Button, ButtonGroup } from 'react-bootstrap';
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
                console.warn("⚠ Backend not responding. Using mock dashboard data.");

                // Fallback mock data
                setDashboardData({
                    totalSupplies: 15,
                    pendingOrders: 3,
                });

                // Optional: show message in console or UI
                setError('Backend not available — showing mock data');
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, []);
    
    return (
        <Container className="mt-4">
            <h1 className="text-center mb-4">Supplier Portal</h1>

            {/* Navigation buttons */}
            <div className="d-flex justify-content-center mb-4">
                <ButtonGroup>
                    <Button
                        variant={activeTab === 'dashboard' ? 'primary' : 'outline-primary'}
                        onClick={() => setActiveTab('dashboard')}
                    >
                        Dashboard
                    </Button>
                    <Button
                        variant={activeTab === 'management' ? 'primary' : 'outline-primary'}
                        onClick={() => setActiveTab('management')}
                    >
                        Management
                    </Button>
                    <Button
                        variant={activeTab === 'profile' ? 'primary' : 'outline-primary'}
                        onClick={() => setActiveTab('profile')}
                    >
                        Profile
                    </Button>
                    <Button
                        variant={activeTab === 'analytics' ? 'primary' : 'outline-primary'}
                        onClick={() => setActiveTab('analytics')}
                    >
                        Analytics
                    </Button>
                </ButtonGroup>
            </div>

            {/* Active section */}
            {!loading && dashboardData && (
                <>
                    {activeTab === 'dashboard' && <SupplierDashboard data={dashboardData} />}
                    {activeTab === 'profile' && <SupplierProfile />}
                    {activeTab === 'management' && <SupplierProducts />}
                    {activeTab === 'analytics' && <SupplierAnalytics />}
                </>
            )}
        </Container>
    );
};

export default SupplierPage;