// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Adjust the path as needed

function PrivateRoute({ element, requiredRole }) {
    const { user } = useAuth();

    const isAuthorized = user.isLoggedIn && (!requiredRole || user.role === requiredRole);

    return isAuthorized ? element : <Navigate to="" />;
}

export default PrivateRoute;
