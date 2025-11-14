import React, { useEffect, useState, useMemo } from "react";
import "./styles/VetHistoryPage.css";
import { apiGetMyVetConsults } from "../../api/vetConsults.js";
import { Clock, MessageCircle, Video, AlertTriangle } from "lucide-react";

export default function VetHistoryPage() {
  const [rows, setRows] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await apiGetMyVetConsults();
        setRows(data);
      } catch (err) {
        console.error(err);
        setErrorMsg("Error cargando historial de consultas.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    if (filter === "all") return rows;
    return rows.filter((c) => c.status === filter);
  }, [rows, filter]);

  const fmt = (iso) =>
    new Date(iso).toLocaleString("es-AR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <main className="vh-root pagePadTop">
      <h1 className="vh-title">Historial de Consultas</h1>
      <p className="vh-sub">
        Acá podés ver todas las consultas veterinarias que realizaste.
      </p>

      {/* FILTROS */}
      <div className="vh-filters">
        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          Todas
        </button>
        <button
          className={filter === "pending" ? "active" : ""}
          onClick={() => setFilter("pending")}
        >
          Pendientes
        </button>
        <button
          className={filter === "in_progress" ? "active" : ""}
          onClick={() => setFilter("in_progress")}
        >
          En curso
        </button>
        <button
          className={filter === "done" ? "active" : ""}
          onClick={() => setFilter("done")}
        >
          Finalizadas
        </button>
      </div>

      {loading && <p className="vh-loading">Cargando…</p>}
      {errorMsg && <p className="vh-error">{errorMsg}</p>}

      {/* LISTADO */}
      {!loading && !errorMsg && (
        <div className="vh-list">
          {filtered.length === 0 && (
            <p className="vh-empty">No hay consultas en este estado 🐾</p>
          )}

          {filtered.map((c) => (
            <article key={c.id} className="vh-card">
              <header className="vh-card-header">
                <div>
                  <h2>{c.topic}</h2>
                  <span className={`vh-status ${c.status}`}>
                    {c.status === "pending"
                      ? "Pendiente"
                      : c.status === "in_progress"
                      ? "En curso"
                      : "Finalizada"}
                  </span>
                </div>

                <div className="vh-meta">
                  <span>{fmt(c.created_at)}</span>
                  {c.urgency === "alta" && (
                    <span className="vh-urgency">
                      <AlertTriangle size={14} /> Urgencia alta
                    </span>
                  )}
                </div>
              </header>

              <p className="vh-detail">{c.detail}</p>

              <footer className="vh-footer">
                {c.contact_mode === "chat" ? (
                  <span className="vh-mode">
                    <MessageCircle size={14} /> Chat
                  </span>
                ) : (
                  <span className="vh-mode">
                    <Video size={14} /> Videollamada
                  </span>
                )}
              </footer>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
