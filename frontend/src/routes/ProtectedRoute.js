import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, role, allowedRoles }) => {
    if (!role) return <Navigate to="/login" />; // Redirect to login if no role is set
    if (!allowedRoles.includes(role)) return <Navigate to="/login" />; // Redirect if role is not allowed
    return children; // Render the child component if the role is allowed
};

export default ProtectedRoute;