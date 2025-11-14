// src/pages/Profile/ProfilePage.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../shared/context/AuthContext.jsx";
import { apiGetMyProfile, apiUpdateProfile } from "../../api/user.js";
import "./styles/ProfilePage.css";

export default function ProfilePage() {
  const { user } = useAuth();
  const isVet = user?.role === "vet";

  const [form, setForm] = useState({
    displayName: "",
    email: "",
    phone: "",
    bio: "",
    location: "",
    avatarUrl: "",
    coverUrl: "",
  });

  const [subscription, setSubscription] = useState(null);
  const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [pwdMsg, setPwdMsg] = useState("");
  const [pwdSaving, setPwdSaving] = useState(false);

  /* ======================================================
       Cargar datos reales desde la BD
  ======================================================= */
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const data = await apiGetMyProfile();
        if (!mounted) return;

        setForm({
          displayName: data.full_name || "",
          email: data.email || "",
          phone: data.phone || "",
          bio: data.bio || "",
          location: data.location || "",
          avatarUrl: data.avatar_url || "",
          coverUrl: data.cover_url || "",
        });

        if (data.subscription_plan) {
          setSubscription({
            name: data.subscription_plan,
            price: data.subscription_price,
            at: data.subscription_at,
          });
        }
      } catch (e) {
        console.error("Error cargando perfil:", e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => (mounted = false);
  }, [user]);

  /* =============================
          Manejo del formulario
  ============================== */
  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onPwdChange = (e) =>
    setPwd((p) => ({ ...p, [e.target.name]: e.target.value }));

  /* =============================
            Guardar perfil
  ============================== */
  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");

    try {
      await apiUpdateProfile({
        full_name: form.displayName,
        phone: form.phone,
        bio: form.bio,
        location: form.location,
        avatar_url: form.avatarUrl,
        cover_url: form.coverUrl,
      });

      setMsg("Perfil actualizado ✔");
    } catch {
      setMsg("Error al guardar. Intentá nuevamente.");
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(""), 2000);
    }
  };

  /* =============================
         Cambiar contraseña
  ============================== */
  const fakeChangePassword = () =>
    new Promise((r) => setTimeout(r, 600));

  const onChangePassword = async (e) => {
    e.preventDefault();
    setPwdMsg("");

    if (!pwd.current || !pwd.next || !pwd.confirm)
      return setPwdMsg("Completá todos los campos.");

    if (pwd.next !== pwd.confirm)
      return setPwdMsg("Las contraseñas no coinciden.");

    setPwdSaving(true);

    try {
      await fakeChangePassword();
      setPwdMsg("Contraseña actualizada ✔");
      setPwd({ current: "", next: "", confirm: "" });
    } catch {
      setPwdMsg("No se pudo actualizar la contraseña.");
    } finally {
      setPwdSaving(false);
      setTimeout(() => setPwdMsg(""), 2000);
    }
  };

  /* =========================
        LOADING
  ========================== */
  if (loading)
    return (
      <div className="profile-wrap">
        <div className="skeleton">Cargando perfil…</div>
      </div>
    );

  /* =========================
        RENDER
  ========================== */
  return (
    <div className="profile-wrap">
      {/* ----------------------
            HEADER
      ---------------------- */}
      <section className="profile-hero">
        <img
          className="cover"
          src={
            form.coverUrl ||
            "https://images.unsplash.com/photo-1525253013412-55c1a69a5738?q=80&w=1600"
          }
          alt=""
        />

        <div className="hero-bottom">
          <div className="title-row">
            <div className="avatar-inline">
              {form.avatarUrl ? (
                <img
                  className="avatar-inline-img"
                  src={form.avatarUrl}
                  alt="Avatar"
                />
              ) : (
                <div className="avatar-inline-fallback">
                  {(form.displayName || "??").slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>

            <div className="title-col">
              <h1 className="title-name">
                {form.displayName || "Tu Nombre"}
              </h1>
              <div className="title-chips">
                <span className="role-chip">
                  {isVet ? "Veterinario/a" : "Usuario/a"}
                </span>
              </div>
              <p className="subtitle">
                Gestioná tu información y preferencias.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------
          GRID PRINCIPAL
      ---------------------- */}
      <form className="profile-grid" onSubmit={onSubmit}>
        {/* INFORMACIÓN PERSONAL */}
        <section className="card card--8">
          <h2>Información y contacto</h2>

          <div className="split-2">
            <div className="vstack">
              <div className="field">
                <label>Nombre para mostrar</label>
                <input
                  name="displayName"
                  value={form.displayName}
                  onChange={onChange}
                />
              </div>

              <div className="field">
                <label>Ubicación</label>
                <input
                  name="location"
                  value={form.location}
                  onChange={onChange}
                />
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
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={onChange}
                  disabled
                />
              </div>

              <div className="field">
                <label>Teléfono</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={onChange}
                />
              </div>

              <div className="grid-2">
                <div className="field">
                  <label>Avatar (URL)</label>
                  <input
                    name="avatarUrl"
                    value={form.avatarUrl}
                    onChange={onChange}
                  />
                </div>

                <div className="field">
                  <label>Cover (URL)</label>
                  <input
                    name="coverUrl"
                    value={form.coverUrl}
                    onChange={onChange}
                  />
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

        {/* PLAN VETERINARIO */}
        <section className="card card--4">
          <h2>Mi Plan Veterinario</h2>

          {!subscription && (
            <p>No tenés un plan activo. 🎟 Podés contratar uno desde la sección “Planes”.</p>
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

          <div className="vstack">
            <div className="field">
              <label>Contraseña actual</label>
              <input
                type="password"
                name="current"
                value={pwd.current}
                onChange={onPwdChange}
              />
            </div>

            <div className="field">
              <label>Nueva contraseña</label>
              <input
                type="password"
                name="next"
                value={pwd.next}
                onChange={onPwdChange}
              />
            </div>

            <div className="field">
              <label>Confirmar nueva</label>
              <input
                type="password"
                name="confirm"
                value={pwd.confirm}
                onChange={onPwdChange}
              />
            </div>
          </div>

          <div className="actions">
            {pwdMsg && <span className="msg">{pwdMsg}</span>}
            <button
              className="btn-primary"
              disabled={pwdSaving}
              onClick={onChangePassword}
            >
              {pwdSaving ? "Actualizando…" : "Confirmar"}
            </button>
          </div>
        </section>
      </form>
    </div>
  );
}
