import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './components/Dashboard';
import AdminPage from './pages/AdminPage';
import SellerPage from './pages/SellerPage';
import SupplierPage from './pages/SupplierPage';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import { setAuthToken, fetchUserRole } from './api';

const App = () => {
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = sessionStorage.getItem('token'); // Use sessionStorage
        setAuthToken(token);

        if (token) {
            fetchUserRole()
                .then((userRole) => {
                    setRole(userRole);
                    setLoading(false);
                })
                .catch(() => {
                    setRole(null);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <Router>
            {role && <Navbar role={role} setRole={setRole} />}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
                <Route path="/login" element={<PublicRoute><Login setRole={setRole} /></PublicRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute role={role} allowedRoles={['admin', 'seller', 'supplier']}><Dashboard /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute role={role} allowedRoles={['admin']}><AdminPage /></ProtectedRoute>} />
                <Route path="/seller" element={<ProtectedRoute role={role} allowedRoles={['seller']}><SellerPage /></ProtectedRoute>} />
                <Route path="/supplier" element={<ProtectedRoute role={role} allowedRoles={['supplier']}><SupplierPage /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
};

export default App;