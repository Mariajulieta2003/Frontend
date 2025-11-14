// src/pages/Vet/MyVetConsultsPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { apiGetMyVetConsults } from "../../api/vetConsults.js";
import "./styles/MyVetConsultsPage.css";

const FILTERS = [
  { key: "todas", label: "Todas" },
  { key: "pendiente", label: "Pendientes" },
  { key: "en_progreso", label: "En curso" },
  { key: "resuelta", label: "Resueltas" },
];

const fmt = (iso) =>
  new Date(iso).toLocaleString("es-AR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function MyVetConsultsPage() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("todas");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const rows = await apiGetMyVetConsults();

        const mapped = rows.data.map((c) => ({
          id: c.id,
          petName: c.pet_name,
          species: c.species || "Mascota",
          symptoms: c.symptoms,
          urgency:
            c.urgency === "alta"
              ? "Alta"
              : c.urgency === "baja"
              ? "Baja"
              : "Media",
          status: c.status,
          createdAt: c.created_at,
          plan: c.plan,
        }));

        setItems(mapped);
      } catch (err) {
        console.error(err);
        setErrorMsg("No pudimos cargar tus consultas veterinarias.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filtered = useMemo(() => {
    if (filter === "todas") return items;
    return items.filter((c) => c.status === filter);
  }, [items, filter]);

  return (
    <main className="mvc-root pagePadTop">
      <header className="mvc-header">
        <h1>Mis consultas veterinarias</h1>
        <p>Acá podés ver todo tu historial de consultas.</p>
      </header>

      {/* FILTROS */}
      <div className="mvc-filters">
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            className={`mvc-filterBtn ${filter === key ? "active" : ""}`}
            onClick={() => setFilter(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {loading && <p>Cargando…</p>}
      {errorMsg && <p className="mvc-error">{errorMsg}</p>}

      {!loading && !errorMsg && (
        <>
          <section className="mvc-list">
            {filtered.length === 0 ? (
              <p className="mvc-empty">No hay consultas en este estado.</p>
            ) : (
              filtered.map((c) => (
                <article key={c.id} className="mvc-card">
                  <header className="mvc-cardHeader">
                    <div>
                      <h2>{c.petName}</h2>
                      <span className="mvc-chip">{c.species}</span>
                    </div>
                    <div className="mvc-meta">
                      <span
                        className={`mvc-urgency mvc-urgency-${c.urgency.toLowerCase()}`}
                      >
                        {c.urgency}
                      </span>
                      <time>{fmt(c.createdAt)}</time>
                    </div>
                  </header>

                  <p className="mvc-symptoms">{c.symptoms}</p>

                  <footer className="mvc-footer">
                    <span className={`mvc-status mvc-status-${c.status}`}>
                      {c.status === "pendiente"
                        ? "Pendiente"
                        : c.status === "en_progreso"
                        ? "En curso"
                        : "Resuelta"}
                    </span>

                    <button
                      type="button"
                      className="mvc-moreBtn"
                      onClick={() => setSelected(c)}
                    >
                      Ver detalle
                    </button>
                  </footer>
                </article>
              ))
            )}
          </section>

          {/* MODAL */}
          {selected && (
            <div className="mvc-overlay" onClick={() => setSelected(null)}>
              <div className="mvc-modal" onClick={(e) => e.stopPropagation()}>
                <header className="mvc-modalHeader">
                  <h2>
                    {selected.petName} – {selected.species}
                  </h2>
                  <button className="mvc-close" onClick={() => setSelected(null)}>
                    ×
                  </button>
                </header>

                <p>
                  <strong>Urgencia:</strong> {selected.urgency}
                </p>
                <p>
                  <strong>Estado:</strong>{" "}
                  {selected.status === "pendiente"
                    ? "Pendiente"
                    : selected.status === "en_progreso"
                    ? "En curso"
                    : "Resuelta"}
                </p>
                <p>
                  <strong>Fecha:</strong> {fmt(selected.createdAt)}
                </p>
                <p className="mvc-detailBlock">
                  <strong>Síntomas:</strong> <br />
                  {selected.symptoms}
                </p>

                <div className="mvc-modalActions">
                  <button className="mvc-btnPrimary" onClick={() => setSelected(null)}>
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </main>
  );
}
