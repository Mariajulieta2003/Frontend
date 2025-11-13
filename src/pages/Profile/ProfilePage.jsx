import React, { useEffect, useState } from "react";
import { useAuth } from "../../shared/context/AuthContext.jsx";
import "./styles/ProfilePage.css";

export default function ProfilePage() {
  const { user, role } = useAuth();
  const isVet = role === "vet";

  const [form, setForm] = useState({
    displayName: "",
    email: "",
    phone: "",
    bio: "",
    location: "",
    avatarUrl: "",
    coverUrl: "",
  });

  const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [pwdMsg, setPwdMsg] = useState("");
  const [pwdSaving, setPwdSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await loadProfileStub(user?.uid, role);
        if (mounted && data) setForm((prev) => ({ ...prev, ...data }));
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [user?.uid, role]);

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const onPwdChange = (e) =>
    setPwd((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    try {
      await saveProfileStub(user?.uid, role, form);
      setMsg("Perfil actualizado ✔");
    } catch {
      setMsg("Error al guardar. Intentá nuevamente.");
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(""), 2200);
    }
  };

  const onChangePassword = async (e) => {
    e.preventDefault();
    setPwdMsg("");
    if (!pwd.current || !pwd.next || !pwd.confirm)
      return setPwdMsg("Completá todos los campos.");
    if (pwd.next !== pwd.confirm)
      return setPwdMsg("Las contraseñas no coinciden.");
    setPwdSaving(true);
    try {
      await fakeChangePassword(pwd.current, pwd.next);
      setPwdMsg("Contraseña actualizada ✔");
      setPwd({ current: "", next: "", confirm: "" });
    } catch {
      setPwdMsg("No se pudo actualizar la contraseña.");
    } finally {
      setPwdSaving(false);
      setTimeout(() => setPwdMsg(""), 2200);
    }
  };

  if (loading)
    return (
      <div className="profile-wrap">
        <div className="skeleton">Cargando perfil…</div>
      </div>
    );

  return (
    <div className="profile-wrap">
      {/* HEADER */}
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
                <img className="avatar-inline-img" src={form.avatarUrl} alt="Avatar" />
              ) : (
                <div className="avatar-inline-fallback">
                  {(form.displayName || "??").slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            <div className="title-col">
              <h1 className="title-name">{form.displayName || "Tu Nombre"}</h1>
              <div className="title-chips">
                <span className="role-chip">
                  {isVet ? "Veterinario/a" : "Usuario/a"}
                </span>
              </div>
              <p className="subtitle">Gestioná tu información y preferencias.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FORMULARIO */}
      <form className="profile-grid" onSubmit={onSubmit}>
        {/* INFORMACIÓN */}
        <section className="card card--8">
          <h2>Información y contacto</h2>
          <div className="split-2">
            {/* Columna izquierda */}
            <div className="vstack">
              <div className="field">
                <label>Nombre para mostrar</label>
                <small className="hint-sub">
                  Usá tu nombre completo o como querés que te vean los demás.
                </small>
                <input
                  name="displayName"
                  value={form.displayName}
                  onChange={onChange}
                  placeholder="Ej: Julieta Rodríguez"
                />
              </div>

              <div className="field">
                <label>Ubicación</label>
                <small className="hint-sub">Indicá tu ciudad y provincia actual.</small>
                <input
                  name="location"
                  value={form.location}
                  onChange={onChange}
                  placeholder="Ciudad, Provincia"
                />
              </div>

              <div className="field">
                <label>Sobre mí</label>
                <small className="hint-sub">
                  Escribí una breve descripción o frase personal.
                </small>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={onChange}
                  rows={3}
                  placeholder="Contá un poco sobre vos…"
                />
              </div>
            </div>

            {/* Columna derecha */}
            <div className="vstack">
              <div className="field">
                <label>Email</label>
                <small className="hint-sub">Tu correo de contacto principal.</small>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder="correo@ejemplo.com"
                />
              </div>

              <div className="field">
                <label>Teléfono</label>
                <small className="hint-sub">
                  Número de teléfono o WhatsApp para contacto.
                </small>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={onChange}
                  placeholder="+54 9 ..."
                />
              </div>

              <div className="grid-2">
                <div className="field">
                  <label>Avatar (URL)</label>
                  <small className="hint-sub">
                    Pegá la URL de tu foto de perfil.
                  </small>
                  <input
                    name="avatarUrl"
                    value={form.avatarUrl}
                    onChange={onChange}
                    placeholder="https://…"
                  />
                </div>
                <div className="field">
                  <label>Cover (URL)</label>
                  <small className="hint-sub">
                    Pegá la URL de tu imagen de portada.
                  </small>
                  <input
                    name="coverUrl"
                    value={form.coverUrl}
                    onChange={onChange}
                    placeholder="https://…"
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

        {/* SEGURIDAD */}
        <section className="card card--4">
          <h2>Seguridad</h2>
          <p className="hint">
            Cambiá tu contraseña ingresando la actual y definiendo una nueva. Recordá usar al menos 8 caracteres.
          </p>

          <div className="vstack">
            <div className="field">
              <label>Contraseña actual</label>
              <small className="hint-sub">
                Ingresá la contraseña que usás actualmente.
              </small>
              <input
                type="password"
                name="current"
                value={pwd.current}
                onChange={onPwdChange}
                placeholder="••••••••"
              />
            </div>

            <div className="field">
              <label>Nueva contraseña</label>
              <small className="hint-sub">
                Debe tener mínimo 8 caracteres y combinar letras y números.
              </small>
              <input
                type="password"
                name="next"
                value={pwd.next}
                onChange={onPwdChange}
                placeholder="••••••••"
              />
            </div>

            <div className="field">
              <label>Confirmar nueva</label>
              <small className="hint-sub">
                Reingresá la nueva contraseña para confirmar.
              </small>
              <input
                type="password"
                name="confirm"
                value={pwd.confirm}
                onChange={onPwdChange}
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="actions">
            {pwdMsg && <span className="msg">{pwdMsg}</span>}
            <button className="btn-primary" onClick={onChangePassword} disabled={pwdSaving}>
              {pwdSaving ? "Actualizando…" : "Confirmar"}
            </button>
          </div>
        </section>
      </form>
    </div>
  );
}

/* ====== STUBS ====== */
async function loadProfileStub(uid, role) {
  return {
    displayName: "Tu Nombre",
    email: "tu@email.com",
    phone: "",
    bio: "Amante de los peludos y la adopción responsable.",
    location: "Rosario, Santa Fe",
    avatarUrl: "",
    coverUrl: "",
  };
}
async function saveProfileStub() {
  await new Promise((r) => setTimeout(r, 400));
}
async function fakeChangePassword() {
  await new Promise((r) => setTimeout(r, 600));
}
