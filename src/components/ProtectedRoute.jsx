// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    // Muestra un loader mientras se verifica la autenticación
    return <p>Cargando...</p>;
  }

  if (!user) {
    // Si no hay usuario, redirige al login
    return <Navigate to="/login" replace />;
  }

  // Si hay usuario, muestra el contenido de la ruta (la página)
  return <Outlet />;
};

export default ProtectedRoute;