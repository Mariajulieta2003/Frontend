import React from 'react'

export default function Hero() {
  return (
    <section className="hero">
      <div className="container hero-grid">
        <div className="hero-text">
          <h1>Adopción de<br/>Mascotas</h1>
          <p className="lead">Encuentra a tu compañero ideal. Busca por tamaño, edad, compatibilidad y más — todo en un solo lugar.</p>
          <div className="hero-cta">
            <button className="btn primary">Ver lista</button>
            <button className="btn ghost">Solicitud de adopción</button>
          </div>
        </div>
        <div className="hero-card">
          <div className="card-top">
            <div className="card-tag">Compatible con smartwatch</div>
            <h3>Consulta Veterinario</h3>
            <p>Funciones intuitivas y recordatorios inteligentes para el seguimiento de la salud de tu mascota.</p>
          </div>
          <div className="card-features">
            <ul>
              <li>Conexión con otros dispositivos</li>
              <li>Funciones intuitivas</li>
              <li>Recordatorios inteligentes</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}