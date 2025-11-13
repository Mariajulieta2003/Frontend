import React, { useMemo, useState } from "react";
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


// Mock inicial (luego lo reemplazamos por API)
const seed = [
  {
    id: "q1",
    petName: "Luna",
    petId: "p1",
    fromUser: "María P.",
    preview: "Hola, me interesa adoptarla. ¿Sigue disponible?",
    createdAt: "2025-11-10T17:32:00Z",
    status: "open", // open | answered | archived
    messages: [
      { who: "other", text: "Hola, me interesa adoptarla. ¿Sigue disponible?", at: "2025-11-10T17:32:00Z" },
      { who: "me", text: "¡Hola! sí, sigue publicada 😊", at: "2025-11-10T17:40:00Z" },
    ],
  },
  {
    id: "q2",
    petName: "Michi",
    petId: "p2",
    fromUser: "Diego G.",
    preview: "¿Está vacunado y castrado?",
    createdAt: "2025-11-09T13:10:00Z",
    status: "answered",
    messages: [
      { who: "other", text: "¿Está vacunado y castrado?", at: "2025-11-09T13:10:00Z" },
      { who: "me", text: "Vacunado sí, castrado aún no.", at: "2025-11-09T13:25:00Z" },
    ],
  },
  {
    id: "q3",
    petName: "Toby",
    petId: "p3",
    fromUser: "Sofía C.",
    preview: "¿Pueden traerlo a zona centro?",
    createdAt: "2025-11-08T09:50:00Z",
    status: "archived",
    messages: [
      { who: "other", text: "¿Pueden traerlo a zona centro?", at: "2025-11-08T09:50:00Z" },
    ],
  },
];

const STATUSES = [
  { key: "all", label: "Todas" },
  { key: "open", label: "Abiertas" },
  { key: "answered", label: "Respondidas" },
  { key: "archived", label: "Archivadas" },
];

const formatDate = (iso) =>
  new Date(iso).toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" });

export default function ReceivedRequests() {
  const [items, setItems] = useState(seed);
  const [tab, setTab] = useState("all");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState(null); // consulta activa en modal

  const counts = useMemo(() => {
    const c = { all: items.length, open: 0, answered: 0, archived: 0 };
    items.forEach((it) => (c[it.status] += 1));
    return c;
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((it) => {
      const passTab = tab === "all" ? true : it.status === tab;
      const hay = `${it.petName} ${it.fromUser} ${it.preview}`.toLowerCase();
      const passSearch = hay.includes(q.toLowerCase());
      return passTab && passSearch;
    });
  }, [items, tab, q]);

  // acciones
  const markAnswered = (id) =>
    setItems((arr) => arr.map((x) => (x.id === id ? { ...x, status: "answered" } : x)));

  const archiveOne = (id) =>
    setItems((arr) => arr.map((x) => (x.id === id ? { ...x, status: "archived" } : x)));

  const removeOne = (id) => setItems((arr) => arr.filter((x) => x.id !== id));

  return (
    <div className="queriesContainer pagePadTop">
      {/* Header */}
      <div className="queriesHeader">
        <div>
          <h1 className="pageTitle">Mis consultas</h1>
          <p className="pageSubtitle">
            Gestioná las preguntas de interesados, respondé y marcá el estado como en Mercado Libre.
          </p>
        </div>

        <div className="queriesActions">
          <button className="btn ghost">
            <Filter size={16} /> Filtros
          </button>
        </div>
      </div>

      {/* Tabs + Search */}
      <div className="queriesToolbar">
        <div className="tabs">
          {STATUSES.map(({ key, label }) => (
            <button
              key={key}
              className={`tabBtn ${tab === key ? "active" : ""}`}
              onClick={() => setTab(key)}
            >
              {label}
              <span className="pill">{counts[key]}</span>
            </button>
          ))}
        </div>

        <div className="searchBox">
          <Search size={16} />
          <input
            placeholder="Buscar por mascota, usuario o texto..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      {/* Grid de consultas */}
      {filtered.length === 0 ? (
        <div className="emptyState">
          <MessageSquareText size={22} />
          <h2>No hay consultas {tab !== "all" && `en “${STATUSES.find(s=>s.key===tab)?.label}”`}</h2>
          <p>Cuando te escriban sobre tus publicaciones, van a aparecer aquí.</p>
        </div>
      ) : (
        <div className="queriesGrid">
          {filtered.map((it) => (
            <article key={it.id} className="queryCard">
              <header className="qHeader">
                <span className={`badge ${it.status}`}>
                  {it.status === "open" && "Abierta"}
                  {it.status === "answered" && "Respondida"}
                  {it.status === "archived" && "Archivada"}
                </span>
                <time>{formatDate(it.createdAt)}</time>
              </header>

              <div className="qBody">
                <div className="qPet">
                  <strong>{it.petName}</strong>
                  <span className="qFrom">de {it.fromUser}</span>
                </div>
                <p className="qPreview">{it.preview}</p>
              </div>

              <footer className="qFooter">
                <button className="btn ghost" onClick={() => setSelected(it)}>
                  Ver conversación <ChevronRight size={16} />
                </button>
                <div className="spacer" />
                <button className="btn ghost" onClick={() => markAnswered(it.id)}>
                  <CheckCircle2 size={16} /> Marcar respondida
                </button>
                <button className="btn ghost" onClick={() => archiveOne(it.id)}>
                  <Archive size={16} /> Archivar
                </button>
                <button className="btn danger" onClick={() => removeOne(it.id)}>
                  <Trash2 size={16} /> Eliminar
                </button>
              </footer>
            </article>
          ))}
        </div>
      )}

      {/* Modal conversación */}
      {selected && (
        <QueryThreadModal
          item={selected}
          onClose={() => setSelected(null)}
          onSend={(text) => {
            if (!text.trim()) return;
            setItems((arr) =>
              arr.map((x) =>
                x.id === selected.id
                  ? {
                      ...x,
                      messages: [...x.messages, { who: "me", text, at: new Date().toISOString() }],
                      status: "answered",
                      preview: text,
                    }
                  : x
              )
            );
          }}
        />
      )}
    </div>
  );
}

// Modal en el mismo archivo o exportado aparte
function QueryThreadModal({ item, onClose, onSend }) {
  const [msg, setMsg] = useState("");
  return (
    <div className="qModalBackdrop" onClick={onClose}>
      <div className="qModal" onClick={(e) => e.stopPropagation()}>
        <header className="qModalHeader">
          <h3>Consulta sobre <strong>{item.petName}</strong> — {item.fromUser}</h3>
          <button className="btn ghost" onClick={onClose}>Cerrar</button>
        </header>

        <div className="qThread">
          {item.messages.map((m, i) => (
            <div key={i} className={`bubble ${m.who === "me" ? "me" : "other"}`}>
              <p>{m.text}</p>
              <time>{formatDate(m.at)}</time>
            </div>
          ))}
        </div>

        <footer className="qComposer">
          <input
            placeholder="Escribí tu respuesta…"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (onSend(msg), setMsg(""))}
          />
          <button className="btn primary" onClick={() => (onSend(msg), setMsg(""))}>
            Responder
          </button>
        </footer>
      </div>
    </div>
  );
}
