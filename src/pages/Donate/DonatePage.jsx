import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import "./styles/DonatePage.css";


export default function DonarPage() {
  const [params] = useSearchParams();
  const preset = Number(params.get("m") || 0);

  const quick = useMemo(() => [1000, 2000, 5000, 10000, 20000], []);
  const [amount, setAmount] = useState(preset || "");
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (preset) setAmount(preset);
  }, [preset]);

  const choose = (v) => setAmount(v);

  const submit = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;
    setLoading(true);

    // TODO: reemplazar por tu backend o Firestore
    const payload = {
      amount: Number(amount),
      message: msg,
      createdAt: Date.now(),
    };
    localStorage.setItem("donacion_actual", JSON.stringify(payload));

    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 600);
  };

  return (
    <div className="dv-wrap">
      {/* HERO superior: resumen + caja lateral */}
      <section className="dv-hero">
        <div>
          <h1>Tu ayuda cambia vidas 🐾</h1>
          <p>Cada aporte financia castraciones, alimento y cuidados veterinarios a rescates.</p>
          <ul className="dv-uses">
            <li>🏥 Castraciones y vacunaciones</li>
            <li>🥣 Alimento y medicación</li>
            <li>🏡 Mantenimiento de refugios</li>
            <li>🚑 Traslados y rescates</li>
          </ul>
        </div>

        <div className="dv-card">
          <h3 className="dv-title-sm">Elegí tu aporte</h3>

          <div className="dv-quick">
            {quick.map((v) => (
              <button
                key={v}
                type="button"
                className={`dv-chip ${Number(amount) === v ? "active" : ""}`}
                onClick={() => choose(v)}
              >
                ${v.toLocaleString("es-AR")}
              </button>
            ))}
          </div>

          {!sent ? (
            <form onSubmit={submit}>
              <div className="dv-field">
                <label>Monto (ARS)</label>
                <input
                  type="number"
                  min={1}
                  placeholder="Ej: 2000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              <div className="dv-field">
                <label>Mensaje (opcional)</label>
                <textarea
                  rows={3}
                  placeholder="Podés dejar un mensaje de apoyo 💚"
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                />
              </div>

              <button className="ml-btn-primary" disabled={loading}>
                {loading ? "Procesando…" : "Donar ahora"}
              </button>
            </form>
          ) : (
            <div className="dv-ok">
              ¡Gracias por tu aporte! 💚<br />
              Registramos tu intención (pronto verás el comprobante).
            </div>
          )}

          <div style={{ marginTop: 10, fontSize: 13, color: "#6b7280" }}>
            ¿Preferís ayudar con tiempo?{" "}
            <Link to="/voluntariado">Sumate como voluntaria/o ↗</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
