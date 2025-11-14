import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../shared/context/AuthContext.jsx";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const go = (to) => () => navigate(to);

  return (
    <nav className="navbar">
      {/* IZQUIERDA */}
      <div className="navbar-logo">
        <NavLink to="/">PELUDITOS HOME 🏠 🐾</NavLink>
      </div>

      {/* CENTRO */}
      <div className="nav-links">

        {/* PÚBLICO */}
        {(!user || !user.role) && (
          <>
            <NavLink to="/planes">NUESTROS PLANES</NavLink>
            <NavLink to="/donar">DONAR</NavLink>
            <NavLink to="/voluntariado">SER VOLUNTARIO/A</NavLink>
          </>
        )}

        {/* USER */}
        {user?.role === "user" && (
          <>
            <NavLink to="/pets">Mascotas</NavLink>
            <NavLink to="/my-pets">Mis Mascotas</NavLink>
            <NavLink to="/my-requests">Mis Solicitudes</NavLink>
            <NavLink to="/incoming-requests">Solicitudes Recibidas</NavLink>
            <NavLink to="/planes">Planes</NavLink>
            <NavLink to="/vet/contact">Charlar con un veterinario</NavLink>
            <NavLink to="/support">Soporte</NavLink>
            <NavLink to="/profile">Mi Perfil</NavLink>
          </>
        )}

        {/* VETERINARIO */}
        {user?.role === "vet" && (
          <>
            <NavLink to="/vet/queue">Mis Consultas</NavLink>
            <NavLink to="/support">Soporte</NavLink>
            <NavLink to="/donar">Donar</NavLink>
            <NavLink to="/profile">Mi Perfil</NavLink>
          </>
        )}
      </div>

      {/* DERECHA */}
      <div className="nav-auth">
        {!user ? (
          <>
            <button className="btn btn-secondary-nav" onClick={go("/login")}>
              Iniciar Sesión
            </button>
            <button className="btn btn-primary-nav" onClick={go("/register")}>
              Registrarse
            </button>
          </>
        ) : (
          <>
            <button className="btn btn-secondary-nav" onClick={go("/profile")}>
              {user.full_name || "Mi Perfil"}
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
