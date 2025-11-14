import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../shared/context/AuthContext.jsx";  // ⭐ IMPORTANTE
import "./styles/PlanSelector.css";

// IMPORTS de imágenes
import Basic from "/images/Plans/Basic.jpg";
import Plus from "/images/Plans/Plus.jpg";
import Vip from "/images/Plans/Vip.jpg";

// 🔥 EXPORTAMOS LOS PLANES PARA QUE PurchasePage LOS USE
export const PLANS = [
  {
    id: "basic",
    name: "Plan Básico",
    price: 3500,
    priceMonthly: 3500,
    image: Basic,
    badge: "Ideal para empezar",
    description:
      "El Plan Básico ofrece cobertura esencial con consultas por chat 24/7, videollamadas mensuales y recetas digitales.",
    features: ["Consultas por chat 24/7", "3 videollamadas/mes", "Recetas digitales"],
  },
  {
    id: "plus",
    name: "Plan Plus",
    price: 5400,
    priceMonthly: 5400,
    image: Plus,
    badge: "Más elegido",
    description:
      "El Plan Plus combina atención integral 24/7 con descuentos en guardias y recordatorios automáticos de vacunas.",
    features: ["Chat y video 24/7 ilimitado", "20% en guardias", "Recordatorios de vacunas"],
  },
  {
    id: "premium",
    name: "Plan VIP",
    price: 7000,
    priceMonthly: 7000,
    image: Vip,
    badge: "Cobertura total",
    description:
      "El Plan VIP incluye atención ilimitada 24/7 con prioridad, descuentos en farmacia y coordinación de turnos.",
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
            onError={(e) => (e.currentTarget.src = "/img/plan-generic.jpg")}
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
          <p className="ps-modalDescription">{plan.description}</p>
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
  const { user } = useAuth(); // ⭐ PARA SABER SI ESTÁ LOGUEADO
  const [infoPlan, setInfoPlan] = useState(null);

  const goToPurchase = (id) => {
    // ⭐ VALIDAR LOGIN
    if (!user || !user.id) {
      alert("Necesitás iniciar sesión para contratar un plan.");
      return navigate("/login");
    }

    navigate(`/purchase?plan=${id}`);
  };

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
                onError={(e) => (e.currentTarget.src = Basic)}
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
