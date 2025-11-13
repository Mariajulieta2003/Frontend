// src/pages/PetsDetails/PetDetailPage.jsx
import React, { useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { usePets } from "../../shared/context/PetsContext.jsx";
import "./styles/PetDetailPage.css";

export default function PetDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { approvedPets = [] } = usePets();

  const pet = useMemo(
    () => approvedPets.find((p) => String(p.id || p._id) === String(id)) || {},
    [approvedPets, id]
  );

  // ----- UI: formulario de postulación -----
  const [showApply, setShowApply] = useState(false);
  const [applyForm, setApplyForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleApplyChange = (e) =>
    setApplyForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submitApplication = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    // validaciones simples
    if (!applyForm.fullName.trim() || !applyForm.email.trim()) {
      setErrorMsg("Completá al menos tu nombre y correo.");
      return;
    }

    setSending(true);
    try {
      // ====== STUB de guardado ======
      // armamos la solicitud
      const app = {
        id: crypto.randomUUID(),
        petId: pet.id || pet._id,
        petName: pet.name || "Mascota",
        petCategory: pet.category || "Mascota",
        createdAt: new Date().toISOString(),
        contact: {
          name: applyForm.fullName.trim(),
          email: applyForm.email.trim(),
          phone: applyForm.phone.trim(),
        },
        message:
          applyForm.message.trim() ||
          `Hola, me gustaría postularme para adoptar a ${
            pet.name || "la mascota"
          }.`,
        status: "enviada",
      };

      // guardo en localStorage (reemplazá por tu backend/Firestore)
      const key = "myApplications";
      const prev = JSON.parse(localStorage.getItem(key) || "[]");
      localStorage.setItem(key, JSON.stringify([app, ...prev]));

      // opcional: compartir ubicación del usuario si existe (para tu “/pets”)
      try {
        const pos = localStorage.getItem("userPos");
        if (pos) localStorage.setItem("lastApplyUserPos", pos);
      } catch (_) {}

      // cerrar y navegar a Mis Solicitudes
      setShowApply(false);
      navigate("/my-requests", { replace: true });
    } catch (err) {
      console.error(err);
      setErrorMsg("No pudimos enviar la postulación. Intentá nuevamente.");
    } finally {
      setSending(false);
    }
  };

  // ----- Derivados de la publicación -----
  const name = pet.name || "Mascota en adopción";
  const category = pet.category || "Mascota";
  const imgs = (pet.images || []).map((x) => x?.url || x).filter(Boolean);
  const mainImg =
    imgs[0] || pet.photoURL || "https://placehold.co/960x600?text=Mascota";
  const zonaTxt =
    [pet.city, pet.state, pet.province].filter(Boolean).join(", ") ||
    "Ubicación no especificada";

  const userPos = (() => {
    try {
      const s = localStorage.getItem("userPos");
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  })();
  const petPos = (() => {
    const lat =
      pet.lat ?? pet.latitude ?? pet.location?.lat ?? pet.coords?.lat ?? null;
    const lng =
      pet.lng ?? pet.longitude ?? pet.location?.lng ?? pet.coords?.lng ?? null;
    return typeof lat === "number" && typeof lng === "number" ? { lat, lng } : null;
  })();
  const distanceKm = (() => {
    if (!userPos || !petPos) return null;
    const R = 6371;
    const dLat = ((petPos.lat - userPos.lat) * Math.PI) / 180;
    const dLon = ((petPos.lng - userPos.lng) * Math.PI) / 180;
    const la1 = (userPos.lat * Math.PI) / 180;
    const la2 = (petPos.lat * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(la1) * Math.cos(la2) * Math.sin(dLon / 2) ** 2;
    return Math.round(2 * R * Math.asin(Math.sqrt(a)));
  })();

  const facts = [
    ["Sexo", pet.sex],
    ["Tamaño", pet.size],
    ["Edad", pet.age],
    ["Energía", pet.energy],
    ["Vacunada", yesNo(pet.vaccinated || pet.isVaccinated)],
    ["Castrada", yesNo(pet.neutered || pet.castrated || pet.isNeutered)],
    [
      "Con niños",
      yesNo(pet.goodWithKids || pet.withKids || pet.kids || pet.children),
    ],
    [
      "Con otras mascotas",
      yesNo(
        (pet.goodWithDogs || pet.withDogs || pet.dogs) ||
          (pet.goodWithCats || pet.withCats || pet.cats)
      ),
    ],
  ].filter(([, v]) => v !== undefined && v !== null && v !== "");

  const contactPhone = pet.contactPhone || pet.shelterPhone || "";
  const contactMail = pet.contactEmail || pet.shelterEmail || "";
  const waLink = contactPhone
    ? `https://wa.me/${digits(contactPhone)}?text=${encodeURIComponent(
        `Hola, me interesa ${name} en adopción.`
      )}`
    : null;
  const mailto = contactMail
    ? `mailto:${contactMail}?subject=${encodeURIComponent(
        "Consulta por adopción"
      )}&body=${encodeURIComponent(`Hola, me interesa ${name}.`)}`
    : null;

  const similares = useMemo(() => {
    const cat = pet.category || "Otro";
    return approvedPets
      .filter(
        (p) =>
          (p.category || "Otro") === cat &&
          String(p.id || p._id) !== String(pet.id || pet._id)
      )
      .slice(0, 6);
  }, [approvedPets, pet]);

  if (!pet || (!pet.id && !pet._id)) {
    return (
      <div className="pd-container">
        <div className="pd-toprow">
          <button className="pd-back" onClick={() => navigate(-1)}>
            ‹ Volver
          </button>
        </div>
        <div className="pd-desc-card">
          <h3 className="pd-subtitle">No encontramos esta publicación</h3>
          <Link to="/pets" className="pd-btn ghost" style={{ marginTop: 8 }}>
            Ir al listado
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pd-container">
      {/* Top row */}
      <div className="pd-toprow">
        <button className="pd-back" onClick={() => navigate(-1)}>
          ‹ Volver
        </button>

        <nav className="pd-breadcrumb">
          <Link to="/pets">Adopción</Link>
          <span>›</span>
          <span>Mascotas</span>
          {category && (
            <>
              <span>›</span>
              <Link to="/pets" className="pd-crumb-cat">
                {category}
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* Título */}
      <header className="pd-header">
        <h1 className="pd-title">
          {name}
          {category && <span className="pd-chip cat">{category}</span>}
          {distanceKm != null && (
            <span className="pd-chip distance">{distanceKm} km</span>
          )}
        </h1>
      </header>

      <section className="pd-main">
        {/* Galería */}
        <div className="pd-gallery">
          <img src={mainImg} alt={name} className="pd-photo-main" />
          {imgs.length > 1 && (
            <div className="pd-thumbs">
              {imgs.map((src, i) => (
                <img key={i} src={src} alt={`${name} foto ${i + 1}`} className="pd-thumb" />
              ))}
            </div>
          )}
        </div>

        {/* Aside */}
        <aside className="pd-aside">
          <div className="pd-card sticky">
            <div className="pd-location">
              <strong>Ubicación</strong>
              <div className="pd-location-text">{zonaTxt}</div>
              {distanceKm != null && (
                <div className="pd-distance">A {distanceKm} km de tu ubicación</div>
              )}
            </div>

            <div className="pd-cta">
              {waLink && (
                <a
                  className="pd-btn secondary"
                  href={waLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  Contactar por WhatsApp
                </a>
              )}
              {mailto && (
                <a className="pd-btn ghost" href={mailto}>
                  Contactar por Email
                </a>
              )}
              {/* Botón principal VERDE (igual a “Usar mi ubicación”) */}
              <button
                className="pd-btn primary ml-btn-primary"
                onClick={() => setShowApply(true)}
              >
                Postularme para adoptar
              </button>
            </div>
          </div>

          <div className="pd-card">
            <h3 className="pd-subtitle">Ficha técnica</h3>
            <ul className="pd-specs">
              {facts.map(([k, v]) => (
                <li key={k}>
                  <span>{k}</span>
                  <strong>{String(v)}</strong>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>

      {/* Descripción */}
      <section className="pd-desc-card">
        <h3 className="pd-subtitle">Descripción</h3>
        <p className="pd-desc">
          {pet.description || "El publicador no agregó descripción."}
        </p>
        {pet.requirements && (
          <>
            <h4 className="pd-subtitle mt">Requisitos de adopción</h4>
            <p className="pd-desc">{pet.requirements}</p>
          </>
        )}
      </section>

      {/* Similares */}
      {similares.length > 0 && (
        <section className="pd-similar">
          <h3 className="pd-subtitle">Mascotas similares</h3>
          <div className="pd-similar-grid">
            {similares.map((s) => {
              const url = `/pets/${s.id || s._id}`;
              const img =
                s.images?.[0]?.url ||
                s.images?.[0] ||
                s.photoURL ||
                "https://placehold.co/320x220?text=Mascota";
              return (
                <Link key={s.id || s._id} to={url} className="pd-similar-card">
                  <img src={img} alt={s.name || "Mascota"} />
                  <div className="pd-similar-name">{s.name || "Mascota"}</div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Modal de postulación */}
      {showApply && (
        <div className="pd-modal">
          <div className="pd-modal-box">
            <div className="pd-modal-head">
              <h3>Postularme para adoptar a {name}</h3>
              <button className="pd-x" onClick={() => setShowApply(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={submitApplication} className="pd-form">
              <div className="pd-grid-2">
                <div className="pd-field">
                  <label>Nombre y apellido</label>
                  <input
                    name="fullName"
                    value={applyForm.fullName}
                    onChange={handleApplyChange}
                    placeholder="Ej: Julieta Rodríguez"
                    required
                  />
                </div>
                <div className="pd-field">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={applyForm.email}
                    onChange={handleApplyChange}
                    placeholder="correo@ejemplo.com"
                    required
                  />
                </div>
              </div>

              <div className="pd-field">
                <label>Teléfono</label>
                <input
                  name="phone"
                  value={applyForm.phone}
                  onChange={handleApplyChange}
                  placeholder="+54 9 ..."
                />
              </div>

              <div className="pd-field">
                <label>Mensaje</label>
                <textarea
                  name="message"
                  rows={4}
                  value={applyForm.message}
                  onChange={handleApplyChange}
                  placeholder={`Hola, me gustaría postularme para adoptar a ${name}.`}
                />
              </div>

              {errorMsg && <div className="pd-error">{errorMsg}</div>}

              <div className="pd-actions">
                <button
                  type="button"
                  className="pd-btn ghost"
                  onClick={() => setShowApply(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="pd-btn primary ml-btn-primary" disabled={sending}>
                  {sending ? "Enviando..." : "Enviar postulación"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function yesNo(v) {
  if (typeof v === "boolean") return v ? "Sí" : "No";
  if (typeof v === "string") {
    const s = v.toLowerCase();
    if (["si", "sí", "true", "1"].includes(s)) return "Sí";
    if (["no", "false", "0"].includes(s)) return "No";
  }
  if (typeof v === "number") return v > 0 ? "Sí" : "No";
  return "—";
}
function digits(s) {
  return String(s).replace(/\D/g, "");
}
