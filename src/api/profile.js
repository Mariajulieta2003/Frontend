import React, { useEffect, useState } from "react";
import { useAuth } from "../../shared/context/AuthContext.jsx";
import { apiGetProfile, apiUpdateProfile } from "../../api/profile.js";
import "./styles/ProfilePage.css";

export default function ProfilePage() {
  const { user } = useAuth();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    bio: "",
    location: "",
    avatar_url: "",
    cover_url: "",
  });

  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" });
  const [pwdMsg, setPwdMsg] = useState("");

  /* ======================================================
       CARGAR PERFIL DESDE BACKEND
  ======================================================= */
  useEffect(() => {
    (async () => {
      try {
        const data = await apiGetProfile();

        setForm({
          full_name: data.full_name || "",
          email: data.email || "",
          phone: data.phone || "",
          bio: data.bio || "",
          location: data.location || "",
          avatar_url: data.avatar_url || "",
          cover_url: data.cover_url || "",
        });

        if (data.subscription_plan) {
          setSubscription({
            name: data.subscription_plan,
            price: data.subscription_price,
            at: data.subscription_at,
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ======================================================
       CAMBIOS EN FORM
  ======================================================= */
  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  /* ======================================================
       GUARDAR PERFIL → BACKEND
  ======================================================= */
  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");

    try {
      await apiUpdateProfile(form);
      setMsg("Perfil actualizado ✔");
    } catch (err) {
      console.error(err);
      setMsg("Error al guardar.");
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(""), 2000);
    }
  };

  /* ======================================================
       LOADING
  ======================================================= */
  if (loading)
    return (
      <div className="profile-wrap">
        <div className="skeleton">Cargando perfil…</div>
      </div>
    );

  /* ======================================================
       RENDER
  ======================================================= */
  return (
    <div className="profile-wrap">
      {/* HEADER */}
      <section className="profile-hero">
        <img
          className="cover"
          src={
            form.cover_url ||
            "https://images.unsplash.com/photo-1525253013412-55c1a69a5738?q=80&w=1600"
          }
          alt=""
        />

        <div className="hero-bottom">
          <div className="title-row">
            <div className="avatar-inline">
              {form.avatar_url ? (
                <img className="avatar-inline-img" src={form.avatar_url} alt="Avatar" />
              ) : (
                <div className="avatar-inline-fallback">
                  {(form.full_name || "??").slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>

            <div className="title-col">
              <h1 className="title-name">{form.full_name || "Tu Nombre"}</h1>
              <span className="role-chip">
                {user.role === "vet" ? "Veterinario/a" : "Usuario/a"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* FORMULARIO */}
      <form className="profile-grid" onSubmit={onSubmit}>
        {/* INFO PERSONAL */}
        <section className="card card--8">
          <h2>Información y contacto</h2>

          <div className="split-2">
            <div className="vstack">
              <div className="field">
                <label>Nombre completo</label>
                <input
                  name="full_name"
                  value={form.full_name}
                  onChange={onChange}
                />
              </div>

              <div className="field">
                <label>Ubicación</label>
                <input name="location" value={form.location} onChange={onChange} />
              </div>

              <div className="field">
                <label>Sobre mí</label>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={onChange}
                  rows={3}
                />
              </div>
            </div>

            <div className="vstack">
              <div className="field">
                <label>Email</label>
                <input name="email" type="email" value={form.email} disabled />
              </div>

              <div className="field">
                <label>Teléfono</label>
                <input name="phone" value={form.phone} onChange={onChange} />
              </div>

              <div className="grid-2">
                <div className="field">
                  <label>Avatar (URL)</label>
                  <input name="avatar_url" value={form.avatar_url} onChange={onChange} />
                </div>
                <div className="field">
                  <label>Cover (URL)</label>
                  <input name="cover_url" value={form.cover_url} onChange={onChange} />
                </div>
              </div>
            </div>
          </div>

          <div className="actions">
            {msg && <span className="msg">{msg}</span>}
            <button className="btn-primary" disabled={saving}>
              {saving ? "Guardando…" : "Guardar cambios"}
            </button>
          </div>
        </section>

        {/* PLAN */}
        <section className="card card--4">
          <h2>Mi Plan Veterinario</h2>

          {!subscription && (
            <p>No tenés un plan activo. Podés contratar uno desde “Planes”.</p>
          )}

          {subscription && (
            <div className="planBox">
              <h3>{subscription.name}</h3>
              <p><strong>Precio:</strong> ${subscription.price}</p>
              <p><strong>Inicio:</strong> {new Date(subscription.at).toLocaleDateString()}</p>
              <span className="badge active">Plan activo ✔</span>
            </div>
          )}
        </section>

        {/* SEGURIDAD */}
        <section className="card card--4">
          <h2>Seguridad</h2>

          <p>Este módulo se habilitará cuando conectemos cambio de contraseña real.</p>
        </section>
      </form>
    </div>
  );
}

/* ====== (ELIMINADO: stubs innecesarios) ====== */
