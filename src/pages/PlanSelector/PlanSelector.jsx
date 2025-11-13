import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import "./styles/PlanSelector.css";

// IMPORTS de imágenes
import Basic from "/images/Plans/Basic.jpg";
import Plus from "/images/Plans/Plus.jpg";
import Vip from "/images/Plans/Vip.jpg";

const PLANS = [
  {
    id: "basic",
    name: "Plan Básico",
    price: 3500,
    image: Basic,
    badge: "Ideal para empezar",
    description:
      "El Plan Básico ofrece una cobertura esencial y accesible para quienes buscan acompañamiento veterinario sin complicaciones. Es ideal para quienes desean una atención confiable para su mascota, contando con consultas por chat disponibles las 24 horas, donde un profesional podrá resolver dudas generales, orientar sobre síntomas y guiar sobre los cuidados necesarios. Además, incluye videollamadas mensuales para una evaluación más completa y recetas digitales, para que puedas acceder fácilmente a los medicamentos recetados sin necesidad de traslados.",
    features: ["Consultas por chat 24/7", "3 videollamadas/mes", "Recetas digitales"],
  },
  {
    id: "plus",
    name: "Plan Plus",
    price: 5400,
    image: Plus,
    badge: "Más elegido",
    description:
      "El Plan Plus combina una atención integral con más beneficios para tu mascota. Ofrece chat y videollamadas las 24 horas, para que siempre puedas hablar con un profesional, desde consultas simples hasta situaciones más complejas. Incluye recordatorios automáticos de vacunas, descuentos en guardias y documentación digital, para que nunca te quedes sin acompañamiento cuando más lo necesitás.",
    features: ["Chat y video 24/7 ilimitado", "20% en guardias", "Recordatorios de vacunas"],
  },
  {
    id: "premium",
    name: "Plan VIP",
    price: 7000,
    image: Vip,
    badge: "Cobertura total",
    description:
      "El Plan VIP está pensado para quienes quieren brindarle a su mascota el máximo nivel de cuidado. Incluye chat y videollamadas ilimitadas las 24 horas, con prioridad en la respuesta para resolver cualquier situación en pocos minutos. Además, ofrece descuentos en farmacia y coordinación de turnos presenciales, junto con un seguimiento cercano, para que siempre tengas un equipo veterinario disponible cuando lo necesites.",
    features: ["Atención 24/7 ilimitada", "30% en farmacia", "Coordinación de turnos"],
  },
];

function InfoModal({ plan, onClose, onChoose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!plan) return null;

  return createPortal(
    <div
      className="ps-modalBackdrop"
      onMouseDown={(e) => {
        if (e.target.classList.contains("ps-modalBackdrop")) onClose();
      }}
    >
      <div className="ps-modalCard">
        <div className="ps-modalHero">
          <img
            src={plan.image || "/img/plan-generic.jpg"}
            onError={(e) => {
              e.currentTarget.src = "/img/plan-generic.jpg";
            }}
            alt={plan.name}
          />
          {plan.badge && <span className="ps-modalBadge">{plan.badge}</span>}
        </div>

        <div className="ps-modalHeader">
          <h3>{plan.name}</h3>
          <button className="ps-modalClose" onClick={onClose} aria-label="Cerrar">
            ×
          </button>
        </div>

        <div className="ps-modalBody">
          <p className="ps-modalPrice">
            <strong>${plan.price.toLocaleString("es-AR")}</strong> / mes
          </p>

          {/* 🔹 Texto descriptivo del plan */}
          {plan.description && (
            <p className="ps-modalDescription">
              {plan.description}
            </p>
          )}
        </div>

        <div className="ps-modalActions">
          <button className="ps-btnSecondary" onClick={onClose}>
            Cerrar
          </button>
          <button className="ps-planBtn" onClick={onChoose}>
            Elegir este plan
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function PlanSelector() {
  const navigate = useNavigate();
  const [infoPlan, setInfoPlan] = useState(null);

  const goToPurchase = (id) => navigate(`/purchase?plan=${id}`);

  return (
    <div className="plansRoot">
      <div className="plansHead">
        <h2>Elegí tu plan veterinario</h2>
        <p>Asistencia 24hs, recetas digitales y descuentos. Cancelás cuando quieras.</p>
      </div>

      <div className="plansGrid">
        {PLANS.map((p) => (
          <article key={p.id} className="planCard">
            <div className="imageWrap">
              <img
                src={p.image}
                alt={p.name}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = "/images/Plans/Basic.jpg";
                }}
              />
              {p.badge && <span className="ps-badge">{p.badge}</span>}
            </div>

            <div className="cardBody">
              <div className="planHeader">
                <h3>{p.name}</h3>
                <div className="priceLine">
                  <div className="price">${p.price.toLocaleString("es-AR")}</div>
                  <div className="per">/mes</div>
                </div>
              </div>

              <ul className="features">
                {p.features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>

              <div className="btnRow">
                <button className="ps-btnSecondary" onClick={() => setInfoPlan(p)}>
                  Más info
                </button>
                <button className="ps-planBtn" onClick={() => goToPurchase(p.id)}>
                  Seleccionar Plan
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {infoPlan && (
        <InfoModal
          plan={infoPlan}
          onClose={() => setInfoPlan(null)}
          onChoose={() => goToPurchase(infoPlan.id)}
        />
      )}
    </div>
  );
}
