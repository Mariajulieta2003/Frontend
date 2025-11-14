// src/pages/Login/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

import { useAuth } from "../../shared/context/AuthContext.jsx";
import { useMessage } from "../../shared/context/MessageContext.jsx";
import MessageDisplay from "../../shared/MessageDisplay.jsx";

import "./styles/Login.css";
import "../../shared/styles/GlobalStyles.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const msg = useMessage() || {};
  const { messages = [], addMessage, clearMessages } = msg;

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [serverError, setServerError] = useState(null);

  useEffect(() => () => clearMessages?.(), [clearMessages]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    try {
      console.log("🔴 EJECUTANDO HANDLE SUBMIT");

      const res = await axios.post(`${API_URL}/auth/login`, formData);

      console.log("🟢 LOGIN OK", res.data);

      // Guardar sesión
      login(res.data);

      addMessage("Inicio de sesión exitoso", "success");

      // ⬇⬇⬇ ESTA ES LA LÍNEA ARREGLADA ⬇⬇⬇
      navigate("/");

    } catch (err) {
      console.log("🔴 ERROR LOGIN", err.response?.data || err);
      setServerError(err.response?.data?.message || "Error en el servidor");
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

          <form onSubmit={handleSubmit}>
            <div className="loginField">
              <label>Email</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="loginField">
              <label>Contraseña</label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button className="loginBtnSubmit glowBtnInverse" type="submit">
              Iniciar Sesión
            </button>
          </form>

          <div className="loginRegisterLink">
            ¿No tienes una cuenta?
            <Link to="/register"> Regístrate aquí</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
