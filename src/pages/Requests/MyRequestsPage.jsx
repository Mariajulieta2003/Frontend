import React, { useState, useMemo } from "react";
import "./styles/MyRequests.css";

import {
  PawPrint,
  Clock,
  CheckCircle2,
  XCircle,
  MessageCircle,
} from "lucide-react";


const mockRequests = [
  {
    id: "req1",
    petName: "Luna",
    petImg: "https://placekitten.com/200/200",
    shelter: "Refugio San Martín",
    message: "Esperando confirmación de entrevista.",
    status: "pendiente", // pendiente | aprobada | rechazada
    date: "2025-11-10T14:20:00Z",
  },
  {
    id: "req2",
    petName: "Michi",
    petImg: "https://placekitten.com/201/200",
    shelter: "Adoptá un Amigo",
    message: "¡Solicitud aprobada! Pronto te contactaremos para coordinar.",
    status: "aprobada",
    date: "2025-11-07T09:30:00Z",
  },
  {
    id: "req3",
    petName: "Toby",
    petImg: "https://placekitten.com/202/200",
    shelter: "Huellitas del Corazón",
    message: "Lamentablemente Toby ya fue adoptado 😢",
    status: "rechazada",
    date: "2025-11-05T12:00:00Z",
  },
];

const FILTERS = [
  { key: "todas", label: "Todas" },
  { key: "pendiente", label: "Pendientes" },
  { key: "aprobada", label: "Aprobadas" },
  { key: "rechazada", label: "Rechazadas" },
];

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function MyRequestsPage() {
  const [filter, setFilter] = useState("todas");
  const [data] = useState(mockRequests);

  const filtered = useMemo(() => {
    if (filter === "todas") return data;
    return data.filter((r) => r.status === filter);
  }, [filter, data]);

  return (
    <div className="myReqPage pagePadTop">
      <h1 className="pageTitle">Mis solicitudes recibidas</h1>
      <p className="pageSubtitle">
        🐾 Gracias por abrir tu corazón a un nuevo amigo peludo.  
        Acá podés seguir el estado de tus postulaciones y ver cómo avanza cada historia 💚.
      </p>

      {/* Filtros */}
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

      {/* Listado */}
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
                  {r.status === "aprobada" && <CheckCircle2 size={14} />}
                  {r.status === "rechazada" && <XCircle size={14} />}
                  {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                </span>
              </div>
              <p className="reqShelter">
                Refugio: <strong>{r.shelter}</strong>
              </p>
              <p className="reqMsg">“{r.message}”</p>
              <div className="reqFooter">
                <time>{formatDate(r.date)}</time>
                <button className="btn ghost">
                  <MessageCircle size={14} /> Ver conversación
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="emptyState">
          <PawPrint size={26} />
          <h2>No tenés solicitudes {filter !== "todas" && `(${filter})`} aún</h2>
          <p>
            Postulate para adoptar una mascota y seguí su historia desde acá 💕.
          </p>
        </div>
      )}
    </div>
  );
}
