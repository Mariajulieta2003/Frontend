// src/pages/Requests/ReceivedRequestsPage.jsx
import React, { useState, useMemo, useEffect } from "react";
import "./styles/ReceivedRequests.css";

import {
  MessageSquareText,
  CheckCircle2,
  Archive,
  Trash2,
  Search,
  ChevronRight,
  Filter,
} from "lucide-react";

import {
  getReceivedRequests,
  updateAdoptionStatus,
} from "../../api/adoptions.js";

const STATUSES = [
  { key: "all", label: "Todas" },
  { key: "pendiente", label: "Pendientes" },
  { key: "aceptada", label: "Aceptadas" },
  { key: "rechazada", label: "Rechazadas" },
];

const formatDate = (iso) =>
  new Date(iso).toLocaleString("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  });

export default function ReceivedRequestsPage() {
  const [items, setItems] = useState([]);
  const [tab, setTab] = useState("all");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [selected, setSelected] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const rows = await getReceivedRequests();

      const mapped = rows.map((it) => ({
        id: it.id,
        petName: it.pet_name,
        petImg: it.pet_photo,
        adopter: it.adopter_name,
        email: it.adopter_email,
        phone: it.adopter_phone,
        message: it.message,
        status: it.status,
        createdAt: it.created_at,
      }));

      setItems(mapped);
    } catch (err) {
      console.error(err);
      setErrorMsg("No pudimos cargar las solicitudes recibidas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    return items.filter((it) => {
      const passTab = tab === "all" || it.status === tab;
      const text = `${it.petName} ${it.adopter} ${it.message}`.toLowerCase();
      return passTab && text.includes(q.toLowerCase());
    });
  }, [items, tab, q]);

  return (
    <div className="queriesContainer pagePadTop">
      <div className="queriesHeader">
        <div>
          <h1 className="pageTitle">Solicitudes Recibidas</h1>
          <p className="pageSubtitle">Gestioná postulaciones de adopción.</p>
        </div>
      </div>

      <div className="queriesToolbar">
        <div className="tabs">
          {STATUSES.map(({ key, label }) => (
            <button
              key={key}
              className={`tabBtn ${tab === key ? "active" : ""}`}
              onClick={() => setTab(key)}
            >
              {label}
              <span className="pill">
                {key === "all"
                  ? items.length
                  : items.filter((i) => i.status === key).length}
              </span>
            </button>
          ))}
        </div>

        <div className="searchBox">
          <Search size={16} />
          <input
            placeholder="Buscar por mascota o usuario..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      {loading && <p>Cargando solicitudes...</p>}
      {errorMsg && <p className="errorMsg">{errorMsg}</p>}

      {!loading && !errorMsg && (
        <>
          {filtered.length === 0 ? (
            <div className="emptyState">
              <MessageSquareText size={22} />
              <h2>No hay solicitudes</h2>
            </div>
          ) : (
            <div className="queriesGrid">
              {filtered.map((it) => (
                <article key={it.id} className="queryCard">
                  <header className="qHeader">
                    <span className={`badge ${it.status}`}>
                      {it.status.charAt(0).toUpperCase() + it.status.slice(1)}
                    </span>
                    <time>{formatDate(it.createdAt)}</time>
                  </header>

                  <div className="qBody">
                    <div className="qPet">
                      <strong>{it.petName}</strong>
                      <span className="qFrom">de {it.adopter}</span>
                    </div>
                    <p className="qPreview">{it.message}</p>
                  </div>

                  <footer className="qFooter">
                    <button className="btn ghost" onClick={() => setSelected(it)}>
                      Ver detalles <ChevronRight size={16} />
                    </button>
                  </footer>
                </article>
              ))}
            </div>
          )}
        </>
      )}

      {selected && (
        <DetailModal
          item={selected}
          onClose={() => setSelected(null)}
          onAccept={() => updateAdoptionStatus(selected.id, "aceptada").then(load)}
          onReject={() => updateAdoptionStatus(selected.id, "rechazada").then(load)}
        />
      )}
    </div>
  );
}

// ==========================
// MODAL DE DETALLE
// ==========================
function DetailModal({ item, onClose, onAccept, onReject }) {
  return (
    <div className="qModalBackdrop" onClick={onClose}>
      <div className="qModal" onClick={(e) => e.stopPropagation()}>
        <header className="qModalHeader">
          <h3>
            Solicitud para <strong>{item.petName}</strong>
          </h3>
          <button className="btn ghost" onClick={onClose}>
            Cerrar
          </button>
        </header>

        <div className="qDetailData">
          <p>
            <strong>Adoptante:</strong> {item.adopter}
          </p>
          <p>
            <strong>Email:</strong> {item.email}
          </p>
          <p>
            <strong>Teléfono:</strong> {item.phone}
          </p>
          <p className="qMessage">
            “{item.message}”
          </p>
        </div>

        <footer className="qFooterBtns">
          <button className="btn primary" onClick={onAccept}>
            Aceptar
          </button>
          <button className="btn danger" onClick={onReject}>
            Rechazar
          </button>
        </footer>
      </div>
    </div>
  );
}
