// frontend5/src/components/AuthButtons.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css'; // Reutilizamos los mismos estilos del Header

const AuthButtons = () => {
  return (
    <div className="auth-buttons">
      <Link to="/login" className="btn btn-login">Iniciar sesión</Link>
      <Link to="/register" className="btn btn-register">Crear cuenta</Link>
    </div>
  );
};

export default AuthButtons;