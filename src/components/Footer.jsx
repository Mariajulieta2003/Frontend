import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css'; // Crearemos este archivo en el siguiente paso

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <Link to="/">ADOPCIÓN DE MASCOTAS 🐾</Link>
          <p>Cambiando vidas, una mascota a la vez.</p>
        </div>
        <div className="footer-links">
          <h4>Navegación</h4>
          <ul>
            <li><Link to="/mascotas">Mascotas</Link></li>
            <li><Link to="/publicar">Publicar</Link></li>
            <li><Link to="/planes">Planes</Link></li>
            <li><Link to="/login">Iniciar Sesión</Link></li>
          </ul>
        </div>
        <div className="footer-social">
          <h4>Síguenos</h4>
          <div className="social-icons">
            {/* Reemplaza '#' con tus enlaces reales */}
            <a href="#" target="_blank" rel="noopener noreferrer">FB</a>
            <a href="#" target="_blank" rel="noopener noreferrer">IG</a>
            <a href="#" target="_blank" rel="noopener noreferrer">TW</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Refugio de Mascotas. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;