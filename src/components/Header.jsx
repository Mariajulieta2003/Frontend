import React from 'react'

export default function Header() {
  return (
    <header className="header">
      <div className="container header-inner">
        <div className="logo">Adopción <span>de</span> Mascotas</div>
        <nav className="nav">
          <a href="#">USUARIO</a>
          <a href="#">MASCOTAS</a>
          <a href="#">VETERINARIO</a>
          <a href="#">FAVORITOS</a>
          <a href="#">CONSULTA</a>
        </nav>
        <div className="auth">
          <button className="btn ghost">Iniciar sesión</button>
          <button className="btn primary">Crear cuenta</button>
        </div>
      </div>
    </header>
  )
}