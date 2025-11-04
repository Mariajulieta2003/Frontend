import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// 1. IMPORTA TODAS LAS IMÁGENES PARA EL CARRUSEL
import gatoperro from '../assets/images/gato-perro.jpg';
import gatoperro2 from '../assets/images/gato-perro2.jpg';
import gato from '../assets/images/gato.jpg';
import imagendelperro from '../assets/images/imagen-del-perro.jpg';
import perro from '../assets/images/perro.jpg';
import Mascotasadoptadas from '../assets/images/adopciones.jpg';
import gatoDurmiendo from '../assets/images/gato-durmiendo.jpg';

// Array de imágenes para el carrusel
const heroImages = [
  gatoperro,
  gatoperro2,
  gato,
  imagendelperro,
  perro,
  Mascotasadoptadas,
  gatoDurmiendo
];

function HomePage() { 
  // Estado para la imagen actual del carrusel
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Efecto para cambiar la imagen automáticamente
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % heroImages.length
      );
    }, 5000); // Cambia la imagen cada 5 segundos (5000 ms)

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  }, []); // El array vacío asegura que el efecto se ejecute una sola vez al montar

  return (
    <>
      {/* ===== 1. HERO SECTION (AHORA CON CARRUSEL) ===== */}
      <section 
        className="hero-section"
        style={{ 
          // Usa la imagen actual del carrusel como fondo
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${heroImages[currentImageIndex]})` 
        }}
      >
        <h1>Bienvenidos a Adopción de Mascotas</h1>
        <p>
          Conectamos corazones, uniendo mascotas sin hogar con familias llenas de amor. 
          Tu nuevo mejor amigo te está esperando.
        </p>
        <Link to="/mascotas" className="btn btn-primary-hero">
          ¡Encuentra a tu mascota!
        </Link>
      </section>

      {/* ===== 2. ASESORAMIENTO (con "Card") ===== */}
      <section className="page-section asesoramiento-section">
        <div className="card">
          <h2>Asesoramiento Veterinario 24hs</h2>
          <p>
            ¡Tu tranquilidad es nuestra prioridad! Al suscribirte a nuestros planes, 
            obtienes acceso ilimitado a nuestro equipo de veterinarios listos para 
            ayudarte, las 24 horas del día, los 7 días de la semana.
          </p>
          <Link to="/planes" className="btn btn-primary-card btn">
            Ver Planes de Suscripción
          </Link>
        </div>
      </section>

      {/* ===== 3. MOMENTOS FELICES (con "Grid" y "foto-card") ===== */}
      <section className="page-section momentos-felices">
        <h2>Momentos Felices</h2>
        <p className="section-subtitle">Historias de adopciones que cambiaron vidas.</p>
        
        <div className="momentos-felices-grid">
          <div className="foto-card">
            <img src={Mascotasadoptadas} alt="Mascotas adoptadas" /> 
            <p>Mascotas adoptadas</p>
          </div>
          <div className="foto-card">
            <img src={gatoDurmiendo} alt="Gato durmiendo" />
            <p>Gato durmiendo</p>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;