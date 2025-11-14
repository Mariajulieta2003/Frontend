// src/pages/VetQueue/VetQueue.jsx
import React, { useState, useMemo, useEffect } from "react";
import "./styles/VetQueue.css";

import {
  apiGetConsultQueue,
  apiUpdateVetConsultStatus,
} from "../../api/vetConsults.js";

export default function VetQueue() {
  const [consults, setConsults] = useState([]);
  const [filter, setFilter] = useState("pending"); // pending | in_progress | all
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // ==========================
  //  CARGAR CONSULTAS REALES
  // ==========================
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setErrorMsg("");

        const rows = await apiGetConsultQueue(); // backend retorna TODAS

        // Adaptación para UI
        const mapped = rows.map((c) => ({
          id: c.id,
          petName: c.pet_name,
          species: c.species,
          ownerName: c.user_name,
          createdAt: new Date(c.created_at).toLocaleString(),
          urgency:
            c.urgency === "alta"
              ? "Alta"
              : c.urgency === "baja"
              ? "Baja"
              : "Media",
          reason: c.symptoms,
          status:
            c.status === "pendiente"
              ? "pending"
              : c.status === "en_progreso"
              ? "in_progress"
              : "done",
          plan: c.plan || "Plan Básico",
        }));

        setConsults(mapped);
      } catch (err) {
        console.error(err);
        setErrorMsg("No pudimos cargar las consultas veterinarias.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // ==========================
  //  FILTRO
  // ==========================
  const filtered = useMemo(() => {
    if (filter === "all") return consults;
    return consults.filter((c) => c.status === filter);
  }, [consults, filter]);

  // ==========================
  //  ACTUALIZAR ESTADO EN BACKEND
  // ==========================
  const updateStatus = async (id, newStatus) => {
    try {
      const statusBackend =
        newStatus === "pending"
          ? "pendiente"
          : newStatus === "in_progress"
          ? "en_progreso"
          : "resuelta";

      await apiUpdateVetConsultStatus(id, { status: statusBackend });

      // actualizar UI
      setConsults((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, status: newStatus } : c
        )
      );
    } catch (err) {
      console.error(err);
      alert("No se pudo actualizar el estado.");
    }
  };

  return (
    <main className="vetQueue">
      <header className="vq-header">
        <div>
          <h1>Mis Consultas</h1>
          <p>
            Vista de <strong>consultas recibidas</strong> por el veterinario.
            Filtrá, priorizá y abrí cada caso para responder.
          </p>
        </div>

        <div className="vq-badges">
          <span className="vq-pill">
            Pendientes:{" "}
            <strong>
              {consults.filter((c) => c.status === "pending").length}
            </strong>
          </span>
          <span className="vq-pill ghost">
            En curso:{" "}
            <strong>
              {consults.filter((c) => c.status === "in_progress").length}
            </strong>
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

      {/* Errores y carga */}
      {loading && <p>Cargando consultas...</p>}
      {errorMsg && <p className="vq-error">{errorMsg}</p>}

      {/* Lista de consultas */}
      <section className="vq-list">
        {!loading && filtered.length === 0 && (
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
                <span
                  className={`vq-urgency vq-urgency-${c.urgency.toLowerCase()}`}
                >
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

      {/* Panel detallado */}
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
