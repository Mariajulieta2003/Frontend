import React from 'react';
import { Link, NavLink } from 'react-router-dom';
// No necesita importar CSS, App.css ya lo maneja

function Navbar() {
  return (
    <nav className="navbar">
      
      <div className="navbar-logo">
        {/* CAMBIO AQUÍ: Convertido a NavLink con 'end' */}
        <NavLink end to="/">ADOPCIÓN DE MASCOTAS 🐾</NavLink>
      </div>

      <div className="nav-links">
        <NavLink to="/mascotas">Mascotas</NavLink>
        <NavLink to="/publicar">Publicar</NavLink>
        <NavLink to="/veterinario">Veterinario</NavLink>
        <NavLink to="/planes">Planes</NavLink>
      </div>

      <div className="nav-auth">
        <Link to="/login" className="btn btn-secondary-nav btn">Iniciar Sesión</Link>
        <Link to="/register" className="btn btn-primary-nav btn">Registrarse</Link>
      </div>

    </nav>
  );
}

export default Navbar;
