// src/pages/HomePage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css'; // <-- CSS para esta página

// Para el carrusel, usaremos unas imágenes de placeholder
// En el futuro, podemos instalar 'react-responsive-carousel'
const img1 = "https://placedog.net/1000/500?random";
const img2 = "https://placekitten.com/1000/500?image=5";
const img3 = "https://placedog.net/1000/500?id=23";

const HomePage = () => {
  return (
    <div className="home-container">

      {/* --- Sección 1: Hero Principal --- */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Bienvenidos a Adopción de Mascotas</h1>
          <p className="hero-subtitle">
            Conectamos corazones, uniendo mascotas sin hogar con familias 
            llenas de amor. Tu nuevo mejor amigo te está esperando.
          </p>
          <Link to="/mascotas" className="hero-cta-button">
            ¡Encuentra a tu mascota!
          </Link>
        </div>
        <div className="hero-image">
          {/* Usamos una imagen principal linda */}
          <img src={img1} alt="Perro feliz" />
        </div>
      </section>

      {/* --- Sección 2: Asesoramiento Veterinario --- */}
      <section className="vet-section">
        <div className="vet-content">
          <h2>🐾 Asesoramiento Veterinario 24hs</h2>
          <p>
            ¡Tu tranquilidad es nuestra prioridad! Al suscribirte a nuestros 
            planes, obtienes acceso ilimitado a nuestro equipo de 
            veterinarios listos para ayudarte, las 24 horas del día, 
            los 7 días de la semana.
          </p>
          <Link to="/plans" className="vet-cta-button">
            Ver Planes de Suscripción
          </Link>
        </div>
      </section>

      {/* --- Sección 3: Carrusel (Galería Simple) --- */}
      <section className="gallery-section">
        <h2>Momentos Felices</h2>
        <p>Historias de adopciones que cambiaron vidas.</p>
        <div className="gallery-carousel">
          <img src={img2} alt="Gatito adoptado" />
          <img src={img3} alt="Perro jugando" />
          <img src="https://placekitten.com/1000/500?image=16" alt="Gato durmiendo" />
        </div>
      </section>
      
    </div>
  );
};

export default HomePage;