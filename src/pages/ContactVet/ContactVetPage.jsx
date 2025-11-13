// src/pages/ContactVet/ContactVetPage.jsx
import React, { useState, useMemo } from "react";
import "./styles/ContactVetPage.css";
import { Link } from "react-router-dom";

const MOCK_PETS = [
  { id: "p1", name: "Mora", species: "Perro" },
  { id: "p2", name: "Simón", species: "Gato" },
];

export default function ContactVetPage() {
  const [form, setForm] = useState({
    petId: "",
    hasPlan: "yes", // "yes" | "no"
    planType: "plus", // basic | plus | vip
    urgency: "media",
    topic: "",
    detail: "",
    contactMode: "chat", // chat | video
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const planMessage = useMemo(() => {
    if (form.hasPlan === "no") {
      return (
        <>
          <p>
            Actualmente <strong>no tenés un plan veterinario activo</strong>.
          </p>
          <p>
            Podés abonar esta consulta como{" "}
            <strong>consulta única</strong> o contratar un plan para tener
            asistencia 24/7:
          </p>
          <ul className="cvp-planList">
            <li>
              <strong>Plan Básico</strong> – desde <strong>$3.500/mes</strong>{" "}
              (chat 24/7 y videollamadas mensuales).
            </li>
            <li>
              <strong>Plan Plus</strong> –{" "}
              <strong>$5.400/mes</strong> (chat y video ilimitado + descuentos).
            </li>
            <li>
              <strong>Plan VIP</strong> –{" "}
              <strong>$7.000/mes</strong> (prioridad y máximos beneficios).
            </li>
          </ul>
          <p>
            Podés ver el detalle en{" "}
            <Link to="/planes" className="cvp-link">
              Nuestros planes
            </Link>
            .
          </p>
        </>
      );
    }

    const planName =
      form.planType === "basic"
        ? "Plan Básico"
        : form.planType === "plus"
        ? "Plan Plus"
        : "Plan VIP";

    return (
      <p>
        Esta consulta se enviará con la cobertura de tu{" "}
        <strong>{planName}</strong>. Según tu plan, el chat y/o videollamada
        puede estar <strong>incluido sin costo adicional</strong>.
      </p>
    );
  }, [form.hasPlan, form.planType]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    // 👉 Aquí después vas a llamar al backend (POST /api/vet/consults)
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 600); // solo efecto visual
  };

  if (submitted) {
    return (
      <main className="cvp-root">
        <section className="cvp-card cvp-card-centered">
          <h1>Consulta enviada ✅</h1>
          <p>
            Tu solicitud fue enviada al equipo veterinario. Te vamos a avisar por
            notificaciones dentro de la app y por email cuando un profesional tome
            tu caso.
          </p>
          <p className="cvp-small">
            Si marcaste urgencia <strong>alta</strong>, intentaremos responder
            lo antes posible.
          </p>

          <div className="cvp-actions">
            <Link className="cvp-btnPrimary" to="/pets">
              Volver a mascotas
            </Link>
            <button
              type="button"
              className="cvp-btnGhost"
              onClick={() => setSubmitted(false)}
            >
              Enviar otra consulta
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="cvp-root">
      <section className="cvp-header">
        <h1>Charlar con un veterinario</h1>
        <p>
          Completá el formulario para recibir asistencia profesional para tu
          mascota. Según tu plan, podés acceder a chat o videollamadas 24/7.
        </p>
      </section>

      <section className="cvp-layout">
        {/* FORMULARIO PRINCIPAL */}
        <form className="cvp-card cvp-form" onSubmit={handleSubmit}>
          {/* Mascota */}
          <div className="cvp-field">
            <label htmlFor="petId">
              Mascota <span>*</span>
            </label>
            <select
              id="petId"
              name="petId"
              value={form.petId}
              onChange={onChange}
              required
            >
              <option value="">Seleccioná una mascota</option>
              {MOCK_PETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} – {p.species}
                </option>
              ))}
              <option value="other">Otra / No registrada</option>
            </select>
          </div>

          {/* ¿Tiene plan? */}
          <div className="cvp-field-group">
            <div className="cvp-field">
              <label>¿Tenés un plan veterinario activo?</label>
              <div className="cvp-radioRow">
                <label>
                  <input
                    type="radio"
                    name="hasPlan"
                    value="yes"
                    checked={form.hasPlan === "yes"}
                    onChange={onChange}
                  />
                  Sí, tengo un plan
                </label>
                <label>
                  <input
                    type="radio"
                    name="hasPlan"
                    value="no"
                    checked={form.hasPlan === "no"}
                    onChange={onChange}
                  />
                  No tengo plan
                </label>
              </div>
            </div>

            {form.hasPlan === "yes" && (
              <div className="cvp-field">
                <label htmlFor="planType">Plan</label>
                <select
                  id="planType"
                  name="planType"
                  value={form.planType}
                  onChange={onChange}
                >
                  <option value="basic">Plan Básico</option>
                  <option value="plus">Plan Plus</option>
                  <option value="vip">Plan VIP</option>
                </select>
              </div>
            )}
          </div>

          {/* Urgencia */}
          <div className="cvp-field">
            <label>Nivel de urgencia</label>
            <div className="cvp-radioRow">
              <label>
                <input
                  type="radio"
                  name="urgency"
                  value="baja"
                  checked={form.urgency === "baja"}
                  onChange={onChange}
                />
                Baja – consulta general
              </label>
              <label>
                <input
                  type="radio"
                  name="urgency"
                  value="media"
                  checked={form.urgency === "media"}
                  onChange={onChange}
                />
                Media – síntomas molestos
              </label>
              <label>
                <input
                  type="radio"
                  name="urgency"
                  value="alta"
                  checked={form.urgency === "alta"}
                  onChange={onChange}
                />
                Alta – requiere respuesta rápida
              </label>
            </div>
          </div>

          {/* Motivo / asunto */}
          <div className="cvp-field">
            <label htmlFor="topic">
              Motivo de la consulta <span>*</span>
            </label>
            <input
              id="topic"
              name="topic"
              type="text"
              placeholder="Ej: vómitos, cambio de alimento, heridas, conducta…"
              value={form.topic}
              onChange={onChange}
              required
            />
          </div>

          {/* Detalle */}
          <div className="cvp-field">
            <label htmlFor="detail">
              Contanos qué le pasa <span>*</span>
            </label>
            <textarea
              id="detail"
              name="detail"
              rows={5}
              placeholder="Describí los síntomas, desde cuándo los notás, cambios de comportamiento, medicación, etc."
              value={form.detail}
              onChange={onChange}
              required
            />
          </div>

          {/* Modo de contacto */}
          <div className="cvp-field">
            <label>Preferencia de contacto</label>
            <div className="cvp-radioRow">
              <label>
                <input
                  type="radio"
                  name="contactMode"
                  value="chat"
                  checked={form.contactMode === "chat"}
                  onChange={onChange}
                />
                Chat escrito
              </label>
              <label>
                <input
                  type="radio"
                  name="contactMode"
                  value="video"
                  checked={form.contactMode === "video"}
                  onChange={onChange}
                />
                Videollamada
              </label>
            </div>
          </div>

          <small className="cvp-small">
            ⚠️ Ante situaciones de riesgo vital para la mascota, acudí directamente
            a la guardia veterinaria más cercana.
          </small>

          <div className="cvp-actions">
            <button
              type="submit"
              className="cvp-btnPrimary"
              disabled={submitting}
            >
              {submitting ? "Enviando consulta..." : "Enviar consulta"}
            </button>

            <Link className="cvp-btnGhost" to="/support">
              Ir a soporte
            </Link>
          </div>
        </form>

        {/* LADO DERECHO: Mensaje según plan */}
        <aside className="cvp-card cvp-side">
          <h2>Tu cobertura</h2>
          {planMessage}

          {form.hasPlan === "no" && (
            <>
              <hr className="cvp-divider" />
              <p className="cvp-small">
                Si elegís seguir sin plan, la consulta única tiene un costo
                estimado de <strong>$2.000–$3.000</strong> según modalidad y horario.
              </p>
            </>
          )}

          {form.hasPlan === "yes" && (
            <p className="cvp-small">
              Recordá tener tu mascota identificada en{" "}
              <Link to="/my-pets" className="cvp-link">
                Mis Mascotas
              </Link>{" "}
              para que el equipo pueda revisar su historial.
            </p>
          )}
        </aside>
      </section>
    </main>
  );
}
