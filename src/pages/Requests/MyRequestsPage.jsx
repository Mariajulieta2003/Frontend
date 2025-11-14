// src/pages/Requests/MyRequestsPage.jsx
import React, { useState, useMemo, useEffect } from "react";
import "./styles/MyRequests.css";

import {
  PawPrint,
  Clock,
  CheckCircle2,
  XCircle,
  MessageCircle,
} from "lucide-react";

import { getMyRequests } from "../../api/adoptions.js"; // ✅ CORRECTO

const FILTERS = [
  { key: "todas", label: "Todas" },
  { key: "pendiente", label: "Pendientes" },
  { key: "aceptada", label: "Aceptadas" },
  { key: "rechazada", label: "Rechazadas" },
];

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function MyRequestsPage() {
  const [filter, setFilter] = useState("todas");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setErrorMsg("");

        const rows = await getMyRequests(); // 🚀 trae desde /api/adoptions/my

        // Adaptamos backend → UI
        const mapped = rows.map((r) => ({
          id: r.id,
          petName: r.pet_name,
          petImg: r.pet_photo || "https://placehold.co/200x200?text=Mascota",
          message: r.message,
          status: r.status,
          date: r.created_at,
        }));

        setData(mapped);
      } catch (err) {
        console.error(err);
        setErrorMsg("No pudimos cargar tus solicitudes.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filtered = useMemo(() => {
    if (filter === "todas") return data;
    return data.filter((r) => r.status === filter);
  }, [filter, data]);

  return (
    <div className="myReqPage pagePadTop">
      <h1 className="pageTitle">Mis Solicitudes</h1>
      <p className="pageSubtitle">
        🐾 Acá podés ver todas tus postulaciones y su estado 💚.
      </p>

      <div className="reqFilters">
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            className={`filterBtn ${filter === key ? "active" : ""}`}
            onClick={() => setFilter(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {loading && <p>Cargando solicitudes...</p>}
      {errorMsg && <p className="errorMsg">{errorMsg}</p>}

      {!loading && !errorMsg && (
        <>
          <div className="reqCardsGrid">
            {filtered.map((r) => (
              <div key={r.id} className="reqCard">
                <div className="petThumb">
                  <img src={r.petImg} alt={r.petName} />
                </div>

                <div className="reqInfo">
                  <div className="reqHeader">
                    <h3>{r.petName}</h3>

                    <span className={`statusBadge ${r.status}`}>
                      {r.status === "pendiente" && <Clock size={14} />}
                      {r.status === "aceptada" && <CheckCircle2 size={14} />}
                      {r.status === "rechazada" && <XCircle size={14} />}

                      {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                    </span>
                  </div>

                  <p className="reqMsg">“{r.message}”</p>

                  <div className="reqFooter">
                    <time>{formatDate(r.date)}</time>
                    <button className="btn ghost">
                      <MessageCircle size={14} /> Ver detalles
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="emptyState">
              <PawPrint size={26} />
              <h2>No tenés solicitudes {filter !== "todas" && `(${filter})`}.</h2>
              <p>¡Postulate para adoptar y seguí el estado acá! 💕</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
