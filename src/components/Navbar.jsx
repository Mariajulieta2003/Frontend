import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../shared/context/AuthContext.jsx"; 
import "./Navbar.css";                                       

export default function Navbar() {
  const { user, loginAsUser, loginAsVet, logout } = useAuth();
  const navigate = useNavigate();

  const go = (to) => () => navigate(to);

  return (
    <nav className="navbar">
      {/* Izquierda: logo */}
      <div className="navbar-logo">
        <NavLink to="/">PELUDITOS HOME 🏠 🐾 </NavLink>
      </div>

      {/* Centro: menús según estado */}
      <div className="nav-links">
        {!user && (
          <>
            <NavLink to="/plans">NUESTROS PLANES</NavLink>
            <NavLink to="/donate">DONAR</NavLink>
            <NavLink to="/volunteer">SER VOLUNTARIO/A</NavLink>
          </>
        )}

        {user?.role === "user" && (
          <>
            <NavLink to="/pets">Mascotas</NavLink>
            <NavLink to="/my-pets">Mis Mascotas</NavLink>
            <NavLink to="/my-requests">Mis Solicitudes</NavLink>
            <NavLink to="/incoming-requests">Solicitudes Recibidas</NavLink>
            <NavLink to="/plans">Planes</NavLink>
            <NavLink to="/vet/contact">Charlar con un veterinario</NavLink>
            <NavLink to="/support">Soporte</NavLink>
            <NavLink to="/profile">Mi Perfil</NavLink>
          </>
        )}

        {user?.role === "vet" && (
          <>
            <NavLink to="/vet/queue">Mis Consultas</NavLink>
            <NavLink to="/support">Soporte</NavLink>
            <NavLink to="/donar">Donar</NavLink>
            <NavLink to="/vet/profile">Mi Perfil</NavLink>
          </>
        )}
      </div>

      {/* Derecha: auth buttons */}
      <div className="nav-auth">
        {!user ? (
          <>
            <button className="btn btn-secondary-nav" onClick={go("/login")}>Iniciar Sesión</button>
            <button className="btn btn-primary-nav"  onClick={go("/register")}>Registrarse</button>

            {/* Botones de demo (sacalos si ya tenés login real) */}
            <button className="btn" style={{ marginLeft: 8 }} onClick={loginAsUser}>Demo Usuario</button>
            <button className="btn" onClick={loginAsVet}>Demo Veterinario</button>
          </>
        ) : (
          <>
            <button className="btn btn-secondary-nav" onClick={go("/account")}>
              {user.name}
            </button>
            <button className="btn btn-primary-nav" onClick={logout}>
              Salir
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
