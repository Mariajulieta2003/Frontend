import React from 'react';
import { Link } from 'react-router-dom';

// --- CORRECCIÓN AQUÍ: Añadimos .jsx ---
import Navbar from './Navbar.jsx'; 
import AuthButtons from './AuthButtons.jsx'; // <-- El error estaba aquí
// ------------------------------------

import '../styles/Header.css'; // Los CSS no necesitan la extensión

const Header = () => {
  return (
    <header className="main-header">
      <div className="header-content">

        {/* Logo o Título de la Aplicación */}
        <div className="header-brand">
          <Link to="/">
            PELUDITOS HOME 🏠 🐾 
          </Link>
        </div>

        {/* Componente de Navegación */}
        <Navbar />

        {/* Componente de Botones de Autenticación */}
        <AuthButtons />

      </div>
    </header>
  );
};

export default Header;