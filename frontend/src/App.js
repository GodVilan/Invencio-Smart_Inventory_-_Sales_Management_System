import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './components/Dashboard';
// import AdminPage from './pages/AdminPage';
import SellerPage from './pages/SellerPage';
import SellerDashboard from './components/SellerDashboard';
import ProductList from './components/ProductList';
import SalesManagement from './components/SalesManagement';
import SupplierPage from './pages/SupplierPage';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import Profile from './components/Profile';
import ChangePasswordPage from './components/ChangePasswordPage';
import UserManagement from './components/UserManagement';
import ProductManagement from './components/ProductManagement';
import CategoryManagement from './components/CategoryManagement';
import BrandManagement from './components/BrandManagement';
import AdminSalesManagement from './components/AdminSalesManagement';
// import SupplierManagement from './components/SupplierManagement';
import AdminSupplierManagement from './components/AdminSupplierManagement';
import './App.css';
import SupplierDashboard from './components/SupplierDashboard';
import { setAuthToken, fetchUserRole } from './api';

const App = () => {
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
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
                <Route path="/profile" element={<ProtectedRoute role={role} allowedRoles={['admin', 'seller', 'supplier']}><Profile /></ProtectedRoute>} />
                <Route path="/change-password" element={<ProtectedRoute role={role} allowedRoles={['admin', 'seller', 'supplier']}><ChangePasswordPage /></ProtectedRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute role={role} allowedRoles={['admin', 'seller', 'supplier']}><Dashboard /></ProtectedRoute>} />
                {/* <Route path="/admin" element={<ProtectedRoute role={role} allowedRoles={['admin']}><AdminPage /></ProtectedRoute>} /> */}
                <Route path="/seller" element={<ProtectedRoute role={role} allowedRoles={['seller']}><SellerPage /></ProtectedRoute>} />
                <Route path="/seller/dashboard" element={<ProtectedRoute role={role} allowedRoles={['seller']}><SellerDashboard /></ProtectedRoute>} />
                <Route path="/seller/products" element={<ProtectedRoute role={role} allowedRoles={['seller']}><ProductList /></ProtectedRoute>} />
                <Route path="/seller/sales" element={<ProtectedRoute role={role} allowedRoles={['seller']}><SalesManagement /></ProtectedRoute>} />
                <Route path="/supplier" element={<ProtectedRoute role={role} allowedRoles={['supplier']}><SupplierPage /></ProtectedRoute>} />
                <Route path = "/supplier-dashborad" element={<ProtectedRoute role={role} allowedRoles={['supplier']}><SupplierDashboard /></ProtectedRoute>} />
                <Route path="/admin/users" element={<ProtectedRoute role={role} allowedRoles={['admin']}><UserManagement /></ProtectedRoute>} />
                <Route path="/admin/products" element={<ProtectedRoute role={role} allowedRoles={['admin']}><ProductManagement apiEndpoint="/admin/products" /></ProtectedRoute>} />
                <Route path="/admin/categories" element={<ProtectedRoute role={role} allowedRoles={['admin']}><CategoryManagement /></ProtectedRoute>} />
                <Route path="/admin/brands" element={<ProtectedRoute role={role} allowedRoles={['admin']}><BrandManagement /></ProtectedRoute>} />
                <Route path="/admin/sales" element={<ProtectedRoute role={role} allowedRoles={['admin']}><AdminSalesManagement /></ProtectedRoute>} />
                <Route path="/admin/suppliers" element={<ProtectedRoute role={role} allowedRoles={['admin']}><AdminSupplierManagement /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
};

export default App;