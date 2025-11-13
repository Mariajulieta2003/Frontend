import React, { useState } from "react";
import axios from "axios";
import AuthLayout from "./AuthLayout";
import styles from "./styles/ForgotPassword.module.css";
import { Link } from "react-router-dom";
import globalStyles from "../../shared/styles/GlobalStyles.module.css";

const BASE_URL = import.meta.env.VITE_API_BASE || "http://localhost:3000";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setServerError(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setServerError("Ingresá un email válido.");
      return;
    }
    try {
      await axios.post(`${BASE_URL}/api/auth/forgot-password`, { mail: email });
      setDone(true);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Error de servidor.";
      setServerError(msg);
    }
  };

  return (
    <AuthLayout
      title="Recuperar contraseña"
      footer={<div><Link to="/login">Volver al login</Link></div>}
    >
      {serverError && <div className={styles.serverError}>{serverError}</div>}
      {done ? (
        <div className={styles.infoBox}>
          Si el email existe, te enviamos instrucciones para restablecer tu contraseña.
        </div>
      ) : (
        <form className={styles.form} onSubmit={submit} noValidate>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">Email</label>
            <input
              id="email" type="email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          <button type="submit" className={`${styles.submit} ${globalStyles.glowBtnInverse}`}>
            Enviar instrucciones
          </button>
        </form>
      )}
    </AuthLayout>
  );
}
