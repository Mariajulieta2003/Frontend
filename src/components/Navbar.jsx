import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Header.css'; // Reutilizamos los mismos estilos

const Navbar = () => {
  return (
    <nav className="main-nav">
      <ul>
        <li><NavLink to="/mascotas" activeclassname="active">Mascotas</NavLink></li>
        <li><NavLink to="/publish" activeclassname="active">Publicar</NavLink></li>
        <li><NavLink to="/veterinary" activeclassname="active">Veterinario 24h</NavLink></li>
        <li><NavLink to="/plans" activeclassname="active">Planes</NavLink></li>
      </ul>
    </nav>
  );
};

export default Navbar;