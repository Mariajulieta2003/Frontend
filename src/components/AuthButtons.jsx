// src/components/AuthButtons.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // 1. Importamos el hook

const AuthButtons = () => {
    const { user, logout } = useAuth(); // 2. Obtenemos el 'user' y la función 'logout'
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/'); // Redirigimos al inicio después de cerrar sesión
    };

    // 3. Renderizado condicional
    if (user) {
        // Si el usuario ESTÁ logueado
        return (
            <div className="auth-buttons logged-in">
                {/* 'user.nombre' viene del token que decodificamos en AuthContext */}
                <span className="user-greeting">Hola, {user.nombre}</span> 
                <button onClick={handleLogout} className="btn-logout">
                    Cerrar Sesión
                </button>
            </div>
        );
    }

    // Si el usuario NO está logueado
    return (
        <div className="auth-buttons">
            <Link to="/login" className="btn-secondary">
                Iniciar Sesión
            </Link>
            <Link to="/register" className="btn-primary">
                Registrarse
            </Link>
        </div>
    );
};

export default AuthButtons;