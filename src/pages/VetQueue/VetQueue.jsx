// src/pages/VetQueue/index.jsx
import React, { useState, useMemo } from "react";
import "./styles/VetQueue.css";

const MOCK_CONSULTS = [
  {
    id: "c1",
    petName: "Mora",
    species: "Perro",
    ownerName: "Dana Rodríguez",
    createdAt: "2025-11-12 18:30",
    urgency: "Alta",
    reason: "Vómitos y decaimiento desde ayer",
    status: "pending",
    plan: "Plan Plus",
  },
  {
    id: "c2",
    petName: "Simón",
    species: "Gato",
    ownerName: "Valentín Martínez",
    createdAt: "2025-11-12 17:10",
    urgency: "Media",
    reason: "Cojea de la pata trasera izquierda",
    status: "pending",
    plan: "Plan Básico",
  },
  {
    id: "c3",
    petName: "Luna",
    species: "Perro",
    ownerName: "Andrea Pérez",
    createdAt: "2025-11-11 21:45",
    urgency: "Baja",
    reason: "Consulta sobre cambio de alimento",
    status: "in_progress",
    plan: "Plan VIP",
  },
];

export default function VetQueue() {
  const [consults, setConsults] = useState(MOCK_CONSULTS);
  const [filter, setFilter] = useState("pending");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(
    () => consults.filter((c) => (filter === "all" ? true : c.status === filter)),
    [consults, filter]
  );

  const updateStatus = (id, status) => {
    setConsults((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    );
  };

  return (
    <main className="vetQueue">
      <header className="vq-header">
        <div>
          <h1>Mis Consultas </h1>
          <p>
            Vista de <strong>consultas recibidas</strong> por el veterinario.
            Filtrá, priorizá y abrí cada caso para responder.
          </p>
        </div>
        <div className="vq-badges">
          <span className="vq-pill">
            Pendientes:{" "}
            <strong>{consults.filter((c) => c.status === "pending").length}</strong>
          </span>
          <span className="vq-pill ghost">
            En curso:{" "}
            <strong>{consults.filter((c) => c.status === "in_progress").length}</strong>
          </span>
        </div>
      </header>

      {/* Filtros de estado */}
      <div className="vq-filters">
        <button
          className={`vq-tab ${filter === "pending" ? "active" : ""}`}
          onClick={() => setFilter("pending")}
        >
          Pendientes
        </button>
        <button
          className={`vq-tab ${filter === "in_progress" ? "active" : ""}`}
          onClick={() => setFilter("in_progress")}
        >
          En curso
        </button>
        <button
          className={`vq-tab ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          Todas
        </button>
      </div>

      {/* Lista de consultas */}
      <section className="vq-list">
        {filtered.length === 0 && (
          <p className="vq-empty">
            No hay consultas en este estado por el momento. 🐾
          </p>
        )}

        {filtered.map((c) => (
          <article
            key={c.id}
            className={`vq-card vq-card-${c.urgency.toLowerCase()}`}
          >
            <header className="vq-card-header">
              <div>
                <h2>{c.petName}</h2>
                <span className="vq-chip">
                  {c.species} • {c.plan}
                </span>
              </div>
              <div className="vq-meta">
                <span>{c.ownerName}</span>
                <span className="vq-time">{c.createdAt}</span>
                <span className={`vq-urgency vq-urgency-${c.urgency.toLowerCase()}`}>
                  {c.urgency}
                </span>
              </div>
            </header>

            <p className="vq-reason">{c.reason}</p>

            <footer className="vq-actions">
              <span className={`vq-status badge-${c.status}`}>
                {c.status === "pending"
                  ? "Pendiente"
                  : c.status === "in_progress"
                  ? "En curso"
                  : "Finalizada"}
              </span>

              <div className="vq-btn-row">
                <button
                  className="vq-btn-secondary"
                  onClick={() => setSelected(c)}
                >
                  Ver detalle
                </button>

                {c.status === "pending" && (
                  <button
                    className="vq-btn-primary"
                    onClick={() => updateStatus(c.id, "in_progress")}
                  >
                    Tomar consulta
                  </button>
                )}

                {c.status === "in_progress" && (
                  <button
                    className="vq-btn-primary"
                    onClick={() => updateStatus(c.id, "done")}
                  >
                    Finalizar
                  </button>
                )}
              </div>
            </footer>
          </article>
        ))}
      </section>

      {/* Panel lateral / modal sencillo para el detalle */}
      {selected && (
        <div className="vq-detailOverlay" onClick={() => setSelected(null)}>
          <div
            className="vq-detailCard"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="vq-detailHeader">
              <h2>
                {selected.petName} – {selected.ownerName}
              </h2>
              <button
                className="vq-close"
                onClick={() => setSelected(null)}
                aria-label="Cerrar"
              >
                ×
              </button>
            </header>
            <p className="vq-detailLine">
              <strong>Especie:</strong> {selected.species}
            </p>
            <p className="vq-detailLine">
              <strong>Plan:</strong> {selected.plan}
            </p>
            <p className="vq-detailLine">
              <strong>Fecha y hora:</strong> {selected.createdAt}
            </p>
            <p className="vq-detailLine">
              <strong>Motivo de consulta:</strong> {selected.reason}
            </p>

            <div className="vq-detailActions">
              <button
                className="vq-btn-secondary"
                onClick={() => setSelected(null)}
              >
                Cerrar
              </button>
              <button className="vq-btn-primary">
                Abrir chat / videollamada
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

