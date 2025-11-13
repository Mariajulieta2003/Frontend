import React, { useState } from "react";
import "./styles/VolunteerPage.css";

export default function VolunteerPage() {
  return (
    <main className="volunteer-page">
      <section className="volunteer-section">
        <h1>Unite al equipo de voluntariado 🐕</h1>
        <p>
          Tu tiempo y energía pueden marcar la diferencia en la vida de muchos animales.
        </p>

        <form className="volunteer-form">
          <div className="row">
            <label>
              Nombre completo
              <input type="text" placeholder="Tu nombre y apellido" />
            </label>
            <label>
              Email
              <input type="email" placeholder="tuemail@ejemplo.com" />
            </label>
          </div>

          <label>
            Área de interés
            <select>
              <option>Seleccioná una opción</option>
              <option>Asistencia en refugios</option>
              <option>Eventos y campañas</option>
              <option>Transporte de animales</option>
              <option>Comunicación y redes</option>
            </select>
          </label>

          <label>
            Mensaje o disponibilidad
            <textarea placeholder="Contanos tus horarios, experiencia o motivación"></textarea>
          </label>

          <button type="submit" className="btn-primary">Enviar postulación</button>
        </form>
      </section>
    </main>
  );
}
