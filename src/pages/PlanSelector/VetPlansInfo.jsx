import React, { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./styles/VetPlansInfo.css";

export default function VetPlansInfo({ plans = [] }) {
  const navigate = useNavigate();
  const [billing, setBilling] = useState("monthly");
  const [params] = useSearchParams();

  const fallbackPlans = useMemo(
    () => [
      {
        id: "basic",
        name: "Basic",
        priceMonthly: 3999,
        priceYearly: 3999 * 10,
        imageUrl: "/img/plan-basic.jpg",
        badge: "Ideal para empezar",
        features: [
          "Chat 24/7 con veterinarios",
          "Guía de primeros auxilios",
          "Historial clínico por mascota"
        ],
        limits: "2 consultas por mes",
        includesVideo: false
      },
      {
        id: "plus",
        name: "Plus",
        priceMonthly: 6999,
        priceYearly: 6999 * 10,
        imageUrl: "/img/plan-plus.jpg",
        badge: "Más usado",
        features: [
          "Chat 24/7 + Video llamadas",
          "Recordatorios de vacunas y antiparasitarios",
          "Recetas y certificados digitales"
        ],
        limits: "6 consultas por mes",
        includesVideo: true
      },
      {
        id: "premium",
        name: "Premium",
        priceMonthly: 9999,
        priceYearly: 9999 * 10,
        imageUrl: "/img/plan-premium.jpg",
        badge: "Cobertura completa",
        features: [
          "Chat y Video 24/7 ILIMITADO",
          "Plan de salud personalizado",
          "Prioridad en respuesta (<5 min)"
        ],
        limits: "Consultas ilimitadas",
        includesVideo: true
      }
    ],
    []
  );

  const data = plans.length ? plans : fallbackPlans;

  const formatPrice = (n) =>
    n?.toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0
    });

  return (
    <div className="wrapper">
      {/* HERO */}
      <section className="hero">
        <div className="heroText">
          <h1 className="title">Asistencia veterinaria 24 hs</h1>
          <p className="subtitle">
            Elegí el plan que mejor se adapte a tu mascota. Atención inmediata por chat y video, recordatorios y más.
          </p>
        </div>

        {/* Toggle mensual/anual */}
        <div className="billingToggle" role="group" aria-label="Alternar tipo de facturación">
          <button
            type="button"
            className={`toggleBtn ${billing === "monthly" ? "active" : ""}`}
            onClick={() => setBilling("monthly")}
          >
            Mensual
          </button>

          <button
            type="button"
            className={`toggleBtn ${billing === "yearly" ? "active" : ""}`}
            onClick={() => setBilling("yearly")}
            title="Ahorrá 2 meses"
          >
            Anual <span className="saveTag">Ahorrá 2 meses</span>
          </button>
        </div>
      </section>

      {/* TARJETAS */}
      <section className="grid">
        {data.map((p) => {
          const price = billing === "monthly" ? p.priceMonthly : p.priceYearly;

          return (
            <article key={p.id} className="card">
              <div className="imageWrap">
                <img
                  src={p.imageUrl || "/img/plan-generic.jpg"}
                  alt={`Plan ${p.name}`}
                  className="image"
                  onError={(e) => (e.currentTarget.src = "/img/plan-generic.jpg")}
                />
                {p.badge && <span className="badge">{p.badge}</span>}
              </div>

              <div className="body">
                <h2 className="planName">{p.name}</h2>

                <div className="priceRow">
                  <div className="price">{formatPrice(price)}</div>
                  <div className="period">{billing === "monthly" ? "/ mes" : "/ año"}</div>
                </div>

                <ul className="featuresList">
                  {p.features?.map((f, i) => (
                    <li key={i} className="featureItem">
                      <span className="bullet">✓</span> {f}
                    </li>
                  ))}

                  {p.includesVideo && (
                    <li className="featureItem">
                      <span className="bullet">🎥</span> Video consultas incluidas
                    </li>
                  )}

                  {p.limits && (
                    <li className="featureItem">
                      <span className="bullet">ℹ️</span> {p.limits}
                    </li>
                  )}
                </ul>

                {/* ✅ REDIRECCIÓN AL PAGO */}
                <button
                  type="button"
                  className="cta"
                  onClick={() => navigate(`/purchase?plan=${p.id}`)}
                >
                  Elegir {p.name}
                </button>

                <div className="legal">
                  * Sujeto a términos y condiciones del servicio. Atención remota 24/7.
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {/* TABLA COMPARATIVA */}
      <section className="compare">
        <h3 className="compareTitle">Compará beneficios</h3>

        <div className="table">
          <div className="row head">
            <div className="cell">Beneficio</div>
            {data.map((p) => (
              <div key={p.id} className="cell">{p.name}</div>
            ))}
          </div>

          {[
            { k: "Chat 24/7", test: () => true },
            { k: "Video consultas", test: (p) => !!p.includesVideo },
            { k: "Recordatorios", test: (p) => p.features?.some((f) => /recordatorio/i.test(f)) },
            { k: "Consultas ilimitadas", test: (p) => /ilimitad/i.test(p.limits || "") }
          ].map((row) => (
            <div key={row.k} className="row">
              <div className="cell">{row.k}</div>

              {data.map((p) => (
                <div key={p.id} className="cell">
                  {row.test(p) ? "✓" : "—"}
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
