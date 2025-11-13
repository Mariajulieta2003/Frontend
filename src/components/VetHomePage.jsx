import React from "react";
import { Link } from "react-router-dom";
import { Stethoscope, CalendarDays, Syringe, ClipboardCheck } from "lucide-react";
import ".//VetHomePage.css";

export default function VetHomePage() {
  return (
      <section className="section">
        <div className="section__head">
          <h2>Beneficios de contratar un plan de atencion veterinaria</h2>
        </div>
        <div className="grid services">
          <article className="service">
            <div className="service__icon"><CalendarDays size={22}/></div>
            <h3>Agenda de turnos</h3>
            <p>Organizá chequeos iniciales y seguimientos.</p>
          </article>
          <article className="service">
            <div className="service__icon"><Syringe size={22}/></div>
            <h3>Plan vacunatorio</h3>
            <p>Esquemas, recordatorios y constancias.</p>
          </article>
          <article className="service">
            <div className="service__icon"><ClipboardCheck size={22}/></div>
            <h3>Controles post-adopción</h3>
            <p>Checklist de salud y reportes por mascota.</p>
          </article>
        </div>
      </section>
  );
}
