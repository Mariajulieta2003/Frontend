import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { usePets } from "../../shared/context/PetsContext.jsx";
import "./styles/ApplyForAdoption.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

export default function ApplyForAdoption() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { approvedPets = [], currentUser } = usePets?.() || { approvedPets: [] };

  const pet = useMemo(
    () => approvedPets.find((p) => String(p.id || p._id) === String(id)) || {},
    [approvedPets, id]
  );
  const petName = pet?.name || "Mascota";

  // ---- Estado del form
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    hasOtherPets: "",
    hasKids: "",
    housingType: "",      // casa, depto, otro
    outdoorSpace: "",     // sí/no
    commitmentNeuter: "", // sí/no
    message: "",
    acceptPolicy: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  const draftKey = `apply_draft_${id}`;

  // Prefill básico (si tu contexto de usuario lo expone)
  useEffect(() => {
    setForm((f) => ({
      ...f,
      fullName: f.fullName || currentUser?.name || "",
      email: f.email || currentUser?.email || "",
      phone: f.phone || currentUser?.phone || "",
      city: f.city || currentUser?.city || "",
    }));
    // cargar borrador
    try {
      const raw = localStorage.getItem(draftKey);
      if (raw) setForm(JSON.parse(raw));
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.name, currentUser?.email, currentUser?.phone, currentUser?.city]);

  // Guardado de borrador
  useEffect(() => {
    try { localStorage.setItem(draftKey, JSON.stringify(form)); } catch {}
  }, [form, draftKey]);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const errors = {};
    if (!form.fullName.trim()) errors.fullName = "Requerido";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email || "")) errors.email = "Email inválido";
    if (!/^[\d\s+().-]{7,}$/.test(form.phone || "")) errors.phone = "Teléfono inválido";
    if (!form.city.trim()) errors.city = "Requerido";
    ["hasOtherPets","hasKids","housingType","outdoorSpace","commitmentNeuter"].forEach((k)=>{
      if (!String(form[k])) errors[k] = "Seleccioná una opción";
    });
    if (!form.acceptPolicy) errors.acceptPolicy = "Debés aceptar la política de datos";
    return errors;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    const errs = validate();
    if (Object.keys(errs).length) {
      setServerError("Revisá los campos marcados.");
      return;
    }
    setSubmitting(true);
    try {
      // Estructura de payload pensada para tu backend
      const payload = {
        petId: pet.id || pet._id || id,
        petName,
        applicant: {
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          city: form.city.trim(),
        },
        survey: {
          hasOtherPets: form.hasOtherPets === "si",
          hasKids: form.hasKids === "si",
          housingType: form.housingType,
          outdoorSpace: form.outdoorSpace === "si",
          commitmentNeuter: form.commitmentNeuter === "si",
        },
        message: form.message?.trim() || "",
      };

      const res = await fetch(`${API_BASE}/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include", // por si usás cookies/sesión
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || `Error ${res.status}`);
      }

      setSuccess(true);
      try { localStorage.removeItem(draftKey); } catch {}
    } catch (err) {
      setServerError(err.message || "No pudimos enviar la postulación.");
    } finally {
      setSubmitting(false);
    }
  };

if (success) {
  // Redirección automática en 3 segundos
  setTimeout(() => navigate("/pets"), 3000);

  return (
    <div className="apply-success-wrapper">
      <div className="apply-success-card">
        <div className="checkmark">✓</div>

        <h1 className="success-title">¡Tu postulación fue enviada!</h1>

        <p className="success-text">
          Gracias por postularte para adoptar a <strong>{petName}</strong>.
          El refugio o rescatista se pondrá en contacto con vos si sos preseleccionada/o.
        </p>

        <div className="success-buttons">
          <button
            className="success-btn primary"
            onClick={() => navigate("/pets")}
          >
            Volver al listado
          </button>

          <Link className="success-btn ghost" to={`/pets/${id}`}>
            Ver publicación
          </Link>
        </div>

        <p className="auto-redirect">
          Serás redirigida automáticamente en 3 segundos…
        </p>
      </div>
    </div>
  );
}


  return (
    <div className="apply-container">
      <div className="apply-top">
        <button className="apply-back" onClick={() => navigate(-1)}>‹ Volver</button>
        <nav className="apply-breadcrumb">
          <Link to="/pets">Adopción</Link><span>›</span>
          <Link to={`/pets/${id}`}>{petName}</Link><span>›</span>
          <span>Postularme</span>
        </nav>
      </div>

      <div className="apply-grid">
        {/* Formulario */}
        <form className="apply-form" onSubmit={onSubmit} noValidate>
          <h1 className="apply-title">Postularme para adoptar</h1>
          <p className="apply-sub">Completa tus datos y contanos un poco sobre tu hogar.</p>

          {serverError && <div className="apply-error">{serverError}</div>}

          <div className="f-row">
            <div className="f-col">
              <label>Nombre y apellido</label>
              <input
                value={form.fullName}
                onChange={(e) => update("fullName", e.target.value)}
                placeholder="Ej: Julieta Rodríguez"
                required
              />
            </div>
            <div className="f-col">
              <label>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="tu@email.com"
                required
              />
            </div>
          </div>

          <div className="f-row">
            <div className="f-col">
              <label>Teléfono</label>
              <input
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="+54 9 ..."
                required
              />
            </div>
            <div className="f-col">
              <label>Ciudad</label>
              <input
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
                placeholder="Ej: Rosario, Santa Fe"
                required
              />
            </div>
          </div>

          <div className="f-row">
            <div className="f-col">
              <label>¿Tenés otras mascotas?</label>
              <select value={form.hasOtherPets} onChange={(e) => update("hasOtherPets", e.target.value)} required>
                <option value="">Seleccioná…</option>
                <option value="si">Sí</option>
                <option value="no">No</option>
              </select>
            </div>
            <div className="f-col">
              <label>¿Hay niñas/os en el hogar?</label>
              <select value={form.hasKids} onChange={(e) => update("hasKids", e.target.value)} required>
                <option value="">Seleccioná…</option>
                <option value="si">Sí</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>

          <div className="f-row">
            <div className="f-col">
              <label>Tipo de vivienda</label>
              <select value={form.housingType} onChange={(e) => update("housingType", e.target.value)} required>
                <option value="">Seleccioná…</option>
                <option value="casa">Casa</option>
                <option value="departamento">Departamento</option>
                <option value="otra">Otra</option>
              </select>
            </div>
            <div className="f-col">
              <label>¿Tiene espacio exterior?</label>
              <select value={form.outdoorSpace} onChange={(e) => update("outdoorSpace", e.target.value)} required>
                <option value="">Seleccioná…</option>
                <option value="si">Sí</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>

          <div className="f-row">
            <div className="f-col">
              <label>¿Compromiso de castración (si aplica)?</label>
              <select value={form.commitmentNeuter} onChange={(e) => update("commitmentNeuter", e.target.value)} required>
                <option value="">Seleccioná…</option>
                <option value="si">Sí</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>

          <div className="f-row">
            <div className="f-col w-full">
              <label>Mensaje para el rescatista / refugio</label>
              <textarea
                rows={5}
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                placeholder={`Hola, me gustaría adoptar a ${petName} porque...`}
              />
            </div>
          </div>

          <label className="f-accept">
            <input
              type="checkbox"
              checked={form.acceptPolicy}
              onChange={(e) => update("acceptPolicy", e.target.checked)}
            />
            <span>Acepto el uso de mis datos de contacto para gestionar esta postulación.</span>
          </label>

          <div className="apply-actions">
            <button type="button" className="apply-btn ghost" onClick={() => navigate(-1)}>
              Cancelar
            </button>
            <button type="submit" className="apply-btn primary" disabled={submitting}>
              {submitting ? "Enviando..." : "Enviar postulación"}
            </button>
          </div>
        </form>

        {/* Resumen publicación */}
        <aside className="apply-aside">
          <div className="apply-card">
            <h3 className="apply-subtitle">Te postulás por</h3>
            <div className="apply-pet">
              <img
                src={pet.images?.[0]?.url || pet.images?.[0] || pet.photoURL || "https://placehold.co/320x220?text=Mascota"}
                alt={petName}
              />
              <div className="apply-pet-info">
                <div className="apply-pet-name">{petName}</div>
                <div className="apply-pet-meta">{[pet.city, pet.state, pet.province].filter(Boolean).join(", ")}</div>
              </div>
            </div>
            <Link to={`/pets/${id}`} className="apply-btn link">Ver publicación</Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
