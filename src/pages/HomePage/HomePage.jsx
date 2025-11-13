// src/pages/HomePage/HomePage.jsx
import React, { useState, useEffect } from "react";
import VetHomePage from "../../components/VetHomePage";
import { Link } from "react-router-dom";
import "./styles/HomePage.css";

// Carrusel: imágenes en Frontend/public/images/Carrousel/...
const HERO = [
  "/images/Carrousel/Carrousel.png",
  "/images/Carrousel/Carrousel2.png",
  "/images/Carrousel/Carrousel3.png",
  "/images/Carrousel/Carrousel4.png",
  "/images/Carrousel/Carrousel5.png",
  "/images/Carrousel/Carrousel6.png",
  "/images/Carrousel/Carrousel7.png",
  "/images/Carrousel/Carrousel8.png",
  "/images/Carrousel/Carrousel9.png",
];

// Si también pusiste estas en public, usá rutas absolutas:
const ABOUT_IMG = "/images/HomePage/Nosotros.png";

const SVC = {
  s1: "/images/HomePage/ChequeoInicial.jpg",
  s2: "/images/HomePage/Castraciones.jpg",
  s3: "/images/HomePage/Seguimiento.jpg",
  s4: "/images/HomePage/AsesoriaOnline.jpg",
};

function Carousel() {
  const [i, setI] = useState(0);

  const next = () => setI((p) => (p + 1) % HERO.length);
  const prev = () => setI((p) => (p - 1 + HERO.length) % HERO.length);

  // ⏱️ Auto-avance cada 4 segundos
  useEffect(() => {
    const id = setInterval(() => {
      setI((p) => (p + 1) % HERO.length);
    }, 4000); // cambiá el 4000 si querés más rápido/lento

    return () => clearInterval(id); // limpiamos el intervalo al desmontar
  }, []);

  return (
    <div className="hero">
      <img className="hero-img" src={HERO[i]} alt={`Mascota ${i + 1}`} />
      <button className="hero-nav left" onClick={prev} aria-label="Anterior">
        ‹
      </button>
      <button className="hero-nav right" onClick={next} aria-label="Siguiente">
        ›
      </button>
      <div className="hero-dots">
        {HERO.map((_, idx) => (
          <button
            key={idx}
            className={`dot ${idx === i ? "active" : ""}`}
            onClick={() => setI(idx)}
            aria-label={`Ir a imagen ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="home">
      {/* HERO: texto izquierda + carrusel derecha */}
      <section className="hero-grid">
        <div className="welcome">
          <h1>Encontrá a tu nuevo mejor amigo 🐾</h1>
          <p>
            En <strong>Peluditos Home</strong> conectamos familias con mascotas que
            buscan hogar, con procesos responsables, veterinarios aliados y acompañamiento real.
          </p>

          <ul className="trust left">
            <li>✔ Adopciones seguras</li>
            <li>✔ Seguimiento post adopción</li>
            <li>✔ Transparencia y comunidad</li>
          </ul>
        </div>

        {/* Carrusel en la columna derecha */}
        <Carousel />
      </section>

      {/* VALOR EN 3 PASOS */}
      <section className="steps section">
        <h2>¿Cómo funciona?</h2>
        <div className="grid-3">
          <article className="step">
            <span className="step-num">1</span>
            <h3>Encontrá a tu amigo peludo</h3>
            <p>Buscá según ubicación y características de tu hogar.</p>
          </article>
          <article className="step">
            <span className="step-num">2</span>
            <h3>Conectá</h3>
            <p>Entrevista, verificación y visita responsable.</p>
          </article>
          <article className="step">
            <span className="step-num">3</span>
            <h3>Adoptá con apoyo</h3>
            <p>Guía de adaptación y soporte profesional.</p>
          </article>
        </div>
      </section>

      {/* SOBRE NOSOTROS */}
      <section id="sobre-nosotros" className="section about">
        <div className="about-text">
          <h2>Sobre nosotros</h2>
          <p>
            Somos una red que une rescatistas, refugios, familias y veterinarios.
            Promovemos la tenencia responsable, la castración y la educación.
          </p>
          <div className="badges">
            <span className="badge">+1200 adopciones</span>
            <span className="badge">+900 esterilizaciones</span>
            <span className="badge">Transparencia</span>
          </div>
        </div>
        <img src={ABOUT_IMG} alt=" sobre nosotros" />
      </section>

      {/* OBJETIVOS */}
      <section id="objetivos" className="section goals">
        <h2>Nuestros objetivos</h2>
        <div className="grid-3">
          <article className="card">
            <h3>Adopciones seguras</h3>
            <p>Proceso claro con contrato y seguimiento.</p>
          </article>
          <article className="card">
            <h3>Educación</h3>
            <p>Talleres y guías para convivencia responsable.</p>
          </article>
          <article className="card">
            <h3>Impacto medible</h3>
            <p>Reportes mensuales de lo recaudado y ejecutado.</p>
          </article>
        </div>
      </section>

      {/* SERVICIOS VETERINARIOS */}
      <section id="servicios" className="section services">
        <h2>Servicios veterinarios aliados</h2>
        <div className="grid-4">
          <div className="service">
            <img src={SVC.s1} alt="Chequeo inicial" />
            <h4>Chequeo inicial</h4>
            <p>Plan sanitario y calendario de vacunas.</p>
          </div>
          <div className="service">
            <img src={SVC.s2} alt="Castraciones" />
            <h4>Castraciones</h4>
            <p>Convenios con clínicas y turnos priorizados.</p>
          </div>
          <div className="service">
            <img src={SVC.s3} alt="Seguimiento" />
            <h4> Seguimiento </h4>
            <p>Acompañamiento durante la adaptación.</p>
          </div>
          <div className="service">
            <img src={SVC.s4} alt="Asesoria online" />
            <h4>Asesoría online</h4>
            <p>Conducta, nutrición y salud por chat.</p>
          </div>
        </div>
      </section>

       {/* HERRAMIENTAS VETERINARIAS (agenda, plan, controles) */}
      <VetHomePage />

      {/* PLANES */}
      <section id="planes" className="section plans">
        <h2>Nuestros planes</h2>
        <div className="grid-3">
          <div className="plan">
            <h3>Plan Básico</h3>
            <ul>
              <li>Consultas por chat 24/7</li>
              <li>3 videollamadas/mes</li>
              <li>Recetas digitales</li>
            </ul>
            <Link className="btn-primary" to="/planes">
              Elegir
            </Link>
          </div>
          <div className="plan featured">
            <span className="tag">Recomendado</span>
            <h3>Plan Plus</h3>
            <ul>
              <li>Chat y video 24/7 ilimitado</li>
              <li>20% en guardias</li>
              <li>Recordatorios de vacunas</li>
            </ul>
            <Link className="btn-primary" to="/planes">
              Elegir
            </Link>
          </div>
          <div className="plan">
            <h3>Plan VIP</h3>
            <ul>
              <li>Atención 24/7 ilimitada</li>
              <li>30% en farmacia</li>
              <li>Coordinación de turnos</li>
            </ul>
            <Link className="btn-primary" to="/planes">
              Elegir
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section id="testimonios" className="section testimonials">
        <h2>Experiencias reales</h2>
        <div className="grid-3">
          <article className="t-card">
            <p>“Adoptamos a Mora y nos acompañaron en todo. Cero estrés.”</p>
            <span>— Dana R.</span>
          </article>
          <article className="t-card">
            <p>“La app me dio confianza: historia, vacunas y seguimiento al día.”</p>
            <span>— Valentín M.</span>
          </article>
          <article className="t-card">
            <p>“Como veterinaria, valoro el proceso y la educación a las familias.”</p>
            <span>— Dra. Andrea P.</span>
          </article>
        </div>
      </section>

      {/* MÉTRICAS */}
      <section className="stats">
        <div className="stat">
          <strong>+1.2k</strong>
          <span>Adopciones concretadas</span>
        </div>
        <div className="stat">
          <strong>+900</strong>
          <span>Esterilizaciones</span>
        </div>
        <div className="stat">
          <strong>98%</strong>
          <span>Éxito en adaptación</span>
        </div>
      </section>

      {/* FAQ */}
      <section className="section faq">
        <h2>Preguntas frecuentes</h2>
        <details>
          <summary>¿Cuánto tarda el proceso?</summary>
          <p>Entre 3 y 10 días según entrevistas y agenda del refugio.</p>
        </details>
        <details>
          <summary>¿Puedo tener una prueba de convivencia?</summary>
          <p>Sí, coordinamos visita guiada y periodo de adaptación.</p>
        </details>
        <details>
          <summary>¿Cómo se usan las donaciones?</summary>
          <p>Reportes mensuales: castraciones, alimento y atención médica.</p>
        </details>
      </section>

      {/* DONAR */}
      <section id="donar" className="donate">
        <h2>Tu ayuda cambia vidas</h2>
        <p>Cada aporte financia castraciones, alimento y cuidados a rescates.</p>
        <div className="cta-row">
          <Link className="btn-primary" to="/donar?m=2000">
            Donar ahora
          </Link>
          <Link className="btn-ghost" to="/voluntariado">
            Ser voluntaria/o
          </Link>
        </div>
        <small>Transparencia total: reportes mensuales publicados.</small>
      </section>
    </main>
  );
}
