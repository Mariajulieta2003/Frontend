import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

import { useMessage } from "../../shared/context/MessageContext.jsx";
import MessageDisplay from "../../shared/MessageDisplay.jsx";

import "./styles/Login.css";
import "../../shared/styles/GlobalStyles.css";

function Login({ onLoginSuccess }) {
  const navigate = useNavigate();

  // hooks adentro + defensas
  const msg = useMessage() || {};
  const { messages = [], addMessage, clearMessages } = msg;

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [serverError, setServerError] = useState(null);

  useEffect(() => () => clearMessages?.(), [clearMessages]);

  const validate = (name, value) => {
    let errorMsg = "";
    if (name === "email") {
      if (!value) errorMsg = "El email es requerido.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) errorMsg = "Email inválido.";
    }
    if (name === "password" && !value) errorMsg = "La contraseña es requerida.";
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) validate(name, value);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validate(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    Object.keys(formData).forEach((n) => validate(n, formData[n]));
    const hasErrors = Object.values(errors).some(Boolean);
    const incomplete = Object.values(formData).some((v) => !v);
    if (hasErrors || incomplete) {
      setServerError("Por favor, corrige los errores antes de continuar.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/api/auth/login", {
        mail: formData.email,
        password: formData.password,
      });

      const data = res.data;
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      onLoginSuccess?.(data.user, data.token);
      addMessage?.("Sesión iniciada correctamente.", "success");

      // ⬇️ Derivación por rol
      const role = String(data.user?.role || "").toLowerCase();
      if (role === "vet" || role === "veterinario") {
        navigate("/vet-home");
      } else if (role === "user" || role === "usuario") {
        navigate("/user-home");
      } else if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/"); // fallback
      }
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || "Error de red o del servidor.";
      setServerError(message);
      addMessage?.(message, "error");
    }
  };

  return (
    <>
      {messages.map((m) => (
        <MessageDisplay key={m.id} message={m.text} type={m.type} />
      ))}

      <div className="loginRoot">
        <div className="loginCard">
          <h2 className="loginTitle">Iniciar Sesión</h2>

          {serverError && <div className="loginErrorMessage">{serverError}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="loginField">
              <label htmlFor="email" className="loginLabel">Email</label>
              <div className="inputWrapper">
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`loginInput ${touched.email ? (errors.email ? "inputError" : "inputSuccess") : ""}`}
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                {touched.email && (
                  <div className="validationIcon">
                    {errors.email ? <FaExclamationCircle /> : <FaCheckCircle />}
                  </div>
                )}
              </div>
              {touched.email && errors.email && (
                <span className="errorMessage">{errors.email}</span>
              )}
            </div>

            <div className="loginFieldPassword">
              <label htmlFor="password" className="loginLabel">Contraseña</label>
              <div className="inputWrapper">
                <input
                  type="password"
                  id="password"
                  name="password"
                  className={`loginInputPassword ${touched.password ? (errors.password ? "inputError" : "inputSuccess") : ""}`}
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                {touched.password && (
                  <div className="validationIcon">
                    {errors.password ? <FaExclamationCircle /> : <FaCheckCircle />}
                  </div>
                )}
              </div>
              {touched.password && errors.password && (
                <span className="errorMessage">{errors.password}</span>
              )}
            </div>

            <button type="submit" className="loginBtnSubmit glowBtnInverse">
              Iniciar Sesión
            </button>
          </form>

          <div className="loginRegisterLink">
            ¿No tienes una cuenta?{" "}
            <Link to="/register" className="loginLink">Regístrate aquí</Link>
          </div>

          <div className="loginForgotPasswordLink">
            <Link to="/forgot-password" className="loginLink">¿Olvidaste tu contraseña?</Link>
          </div>

          <div className="back">
            <button type="button" className="backToLoginBtn littleGlowBtn" onClick={() => navigate("/")}>
              Volver
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
