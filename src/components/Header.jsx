//BARRA DE NAVEGACION COMUN
// Implementa los enlaces principales (Mascotas, Veterinario, Iniciar Sesión, etc.).

import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
    return (
        <header className="main-header">
            <div className="logo">
                <Link to="/">ADOPCIÓN DE MASCOTAS 🐾</Link>
            </div>
            <nav className="nav-menu">
                <Link to="/">MASCOTAS (VER LISTA)</Link>
                <Link to="/publish" className="btn-primary">PUBLICAR</Link>
                <Link to="/veterinary">VETERINARIO (CONSULTA)</Link>
                <Link to="/plans">PLANES</Link>
            </nav>
            <div className="auth-buttons">
                <Link to="/login">INICIAR SESIÓN</Link>
                <Link to="/register" className="btn-secondary">CREAR CUENTA</Link>
            </div>
        </header>
    );
};

export default Header;