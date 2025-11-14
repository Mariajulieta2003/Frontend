// src/pages/PetsDetails/PetDetailPage.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { usePets } from "../../shared/context/PetsContext.jsx";
import {
  sendAdoptionRequest
} from "../../api/adoptions.js"; // ✅ NUEVO IMPORT
import "./styles/PetDetailPage.css";

export default function PetDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { approvedPets = [] } = usePets();

  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showApply, setShowApply] = useState(false);
  const [applyForm, setApplyForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
  });

  const [sending, setSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // ==========================
  // 1) CARGAR MASCOTA
  // ==========================
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/pets/${id}`);
        if (res.ok) {
          const data = await res.json();
          setPet(data);

          // 🔥 Autocompletar usuario logueado
          const userRaw = localStorage.getItem("ph_user");
          if (userRaw) {
            const user = JSON.parse(userRaw);
            setApplyForm((f) => ({
              ...f,
              fullName: user.full_name || "",
              email: user.email || "",
              phone: user.phone || "",
            }));
          }
        } else {
          setPet(null);
        }
      } catch (e) {
        console.error("Error cargando mascota", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // fallback si approvedPets ya los tenía
  useEffect(() => {
    if (!pet && !loading) {
      const local = approvedPets.find((p) => String(p.id) === String(id));
      if (local) setPet(local);
    }
  }, [approvedPets, id, pet, loading]);

  // ==========================
  // IMÁGENES
  // ==========================
  const imgs = (pet?.images || []).map((x) => x?.url || x).filter(Boolean);

  const mainImg =
    imgs[0] ||
    pet?.photoURL ||
    pet?.image_url ||
    "https://placehold.co/960x600?text=Mascota";

  // ==========================
  // SIMILARES
  // ==========================
  const similares = useMemo(() => {
    if (!pet) return [];
    const cat = pet.category || "Otro";
    return approvedPets
      .filter((p) => p.category === cat && String(p.id) !== String(pet.id))
      .slice(0, 6);
  }, [approvedPets, pet]);

  // ==========================
  // MAPA
  // ==========================
  const locationText =
    [pet?.city, pet?.province].filter(Boolean).join(", ") ||
    "Ubicación no especificada";

  const googleMapUrl =
    pet?.city && pet?.province
      ? `https://www.google.com/maps?q=${encodeURIComponent(
          `${pet.city} ${pet.province}`
        )}&output=embed`
      : null;

  // ==========================
  // HANDLERS POSTULACIÓN
  // ==========================
  const handleApplyChange = (e) =>
    setApplyForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submitApplication = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const token = localStorage.getItem("ph_token");
    if (!token) {
      alert("Necesitás iniciar sesión para postularte.");
      navigate("/login");
      return;
    }

    if (!applyForm.fullName.trim() || !applyForm.email.trim()) {
      setErrorMsg("Completá tu nombre y correo.");
      return;
    }

    try {
      setSending(true);

      await sendAdoptionRequest({
        pet_id: pet.id,
        message:
          applyForm.message ||
          `Hola, me gustaría postularme para adoptar a ${pet.name}.`,
      });

      setSuccessMsg("¡Postulación enviada!");
      setTimeout(() => navigate("/my-requests"), 1200);
    } catch (err) {
      console.error(err);
      setErrorMsg("Hubo un error. Volvé a intentar.");
    } finally {
      setSending(false);
    }
  };

  // ==========================
  // RENDER
  // ==========================

  if (loading)
    return <div className="pd-loading">Cargando publicación...</div>;

  if (!pet)
    return (
      <div className="pd-container">
        <button className="pd-back" onClick={() => navigate(-1)}>
          ‹ Volver
        </button>
        <div className="pd-desc-card">
          No encontramos esta publicación.
          <Link to="/pets">Ir al listado</Link>
        </div>
      </div>
    );

  return (
    <div className="pd-container">
      <div className="pd-toprow">
        <button className="pd-back" onClick={() => navigate(-1)}>
          ‹ Volver
        </button>
      </div>

      {/* Título */}
      <header className="pd-header">
        <h1 className="pd-title">
          {pet.name}
          <span className="pd-chip">{pet.category}</span>
        </h1>
      </header>

      {/* Principal */}
      <section className="pd-main">
        {/* Galería */}
        <div className="pd-gallery">
          <img src={mainImg} className="pd-photo-main" alt={pet.name} />
          {imgs.length > 1 && (
            <div className="pd-thumbs">
              {imgs.map((src, i) => (
                <img key={i} src={src} className="pd-thumb" />
              ))}
            </div>
          )}
        </div>

        {/* Aside */}
        <aside className="pd-aside">
          <div className="pd-card sticky">
            <strong className="pd-subtitle">Ubicación</strong>
            <p className="pd-location-text">{locationText}</p>

            {googleMapUrl && (
              <iframe
                title="map"
                src={googleMapUrl}
                className="pd-map"
                loading="lazy"
              ></iframe>
            )}

            <button
              className="pd-btn primary ml-btn-primary"
              onClick={() => setShowApply(true)}
            >
              Postularme para adoptar
            </button>
          </div>

          <div className="pd-card">
            <h3 className="pd-subtitle">Ficha técnica</h3>
            <ul className="pd-specs">
              <li><span>Sexo:</span> <strong>{pet.sex || "—"}</strong></li>
              <li><span>Tamaño:</span> <strong>{pet.size || "—"}</strong></li>
              <li><span>Edad:</span> <strong>{pet.age || "—"}</strong></li>
              <li><span>Vacunada:</span> <strong>{pet.is_vaccinated ? "Sí" : "No"}</strong></li>
              <li><span>Castrada:</span> <strong>{pet.is_neutered ? "Sí" : "No"}</strong></li>
              <li><span>Con niños:</span> <strong>{pet.good_with_kids ? "Sí" : "No"}</strong></li>
              <li><span>Con mascotas:</span> <strong>{pet.good_with_pets ? "Sí" : "No"}</strong></li>
            </ul>
          </div>
        </aside>
      </section>

      {/* Descripción */}
      <section className="pd-desc-card">
        <h3 className="pd-subtitle">Descripción</h3>
        <p>{pet.description || "Sin descripción"}</p>
      </section>

      {/* ===================== */}
      {/* MODAL POSTULACIÓN */}
      {/* ===================== */}

      {showApply && (
        <div className="pd-modal">
          <div className="pd-modal-box pretty-form">
            <div className="pd-modal-head new-head">
              <div className="pf-header-left">
                <img src={mainImg} className="pf-avatar" alt={pet.name} />
                <div>
                  <h3 className="pf-title">Postularme para {pet.name}</h3>
                  <p className="pf-sub">Tu información será enviada al dueño.</p>
                </div>
              </div>

              <button className="pd-x" onClick={() => setShowApply(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={submitApplication} className="pf-form">
              <div className="pf-grid">
                <div className="pf-field">
                  <label>Nombre completo</label>
                  <input
                    name="fullName"
                    value={applyForm.fullName}
                    onChange={handleApplyChange}
                    required
                  />
                </div>

                <div className="pf-field">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={applyForm.email}
                    onChange={handleApplyChange}
                    required
                  />
                </div>

                <div className="pf-field">
                  <label>Teléfono</label>
                  <input
                    name="phone"
                    value={applyForm.phone}
                    onChange={handleApplyChange}
                  />
                </div>
              </div>

              <div className="pf-field">
                <label>Mensaje</label>
                <textarea
                  name="message"
                  rows={4}
                  value={applyForm.message}
                  onChange={handleApplyChange}
                  placeholder={`Hola, me gustaría adoptar a ${pet.name}.`}
                />
              </div>

              {errorMsg && <div className="pf-error">{errorMsg}</div>}
              {successMsg && <div className="pf-success">{successMsg}</div>}

              <div className="pf-actions">
                <button
                  type="button"
                  className="pd-btn ghost"
                  onClick={() => setShowApply(false)}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="pd-btn primary"
                  disabled={sending}
                >
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
