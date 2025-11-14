// src/pages/Register
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRegister } from "../../api/auth.js";

import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

import { useMessage } from "../../shared/context/MessageContext.jsx";
import MessageDisplay from "../../shared/MessageDisplay.jsx";

import "./styles/Register.css";
import "../../shared/styles/GlobalStyles.css";

function Register() {
  const navigate = useNavigate();

  const msg = useMessage() || {};
  const { messages = [], addMessage, clearMessages } = msg;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user", // por defecto usuario
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [serverError, setServerError] = useState(null);

  useEffect(() => {
    return () => clearMessages?.();
  }, [clearMessages]);

  const validate = (name, value) => {
    let error = "";

    if (name === "name" && value.trim().length < 3)
      error = "El nombre debe tener al menos 3 caracteres.";

    if (name === "email") {
      if (!value) error = "El email es requerido.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        error = "Formato de email inválido.";
    }

    if (name === "password") {
      if (!value) error = "La contraseña es requerida.";
      else if (value.length < 6)
        error = "La contraseña debe tener al menos 6 caracteres.";
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
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

  try {
    const response = await apiRegister({
      full_name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    });

    addMessage?.("Registro exitoso. Inicia sesión para continuar.", "success");
    navigate("/login");
  } catch (err) {
    const message =
      err?.message || err?.response?.data?.message || "Error al registrar usuario.";
    setServerError(message);
    addMessage?.(message, "error");
  }
};


  return (
    <>
      {messages.map((m) => (
        <MessageDisplay key={m.id} message={m.text} type={m.type} />
      ))}

      <div className="registerRoot">
        <div className="registerCard">
          <h2 className="registerTitle">Crear Cuenta</h2>

          {serverError && <div className="registerErrorMessage">{serverError}</div>}

          <form onSubmit={handleSubmit} noValidate>
            {/* Nombre */}
            <div className="registerField">
              <label className="registerLabel">Nombre</label>
              <div className="inputWrapper">
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`registerInput ${
                    touched.name ? (errors.name ? "inputError" : "inputSuccess") : ""
                  }`}
                />
                {touched.name && (
                  <div className="validationIcon">
                    {errors.name ? <FaExclamationCircle /> : <FaCheckCircle />}
                  </div>
                )}
              </div>
              {errors.name && touched.name && (
                <span className="errorMessage">{errors.name}</span>
              )}
            </div>

            {/* Email */}
            <div className="registerField">
              <label className="registerLabel">Email</label>
              <div className="inputWrapper">
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`registerInput ${
                    touched.email ? (errors.email ? "inputError" : "inputSuccess") : ""
                  }`}
                />
                {touched.email && (
                  <div className="validationIcon">
                    {errors.email ? <FaExclamationCircle /> : <FaCheckCircle />}
                  </div>
                )}
              </div>
              {errors.email && touched.email && (
                <span className="errorMessage">{errors.email}</span>
              )}
            </div>

            {/* Password */}
            <div className="registerField">
              <label className="registerLabel">Contraseña</label>
              <div className="inputWrapper">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`registerInput ${
                    touched.password
                      ? errors.password
                        ? "inputError"
                        : "inputSuccess"
                      : ""
                  }`}
                />
                {touched.password && (
                  <div className="validationIcon">
                    {errors.password ? <FaExclamationCircle /> : <FaCheckCircle />}
                  </div>
                )}
              </div>
              {errors.password && touched.password && (
                <span className="errorMessage">{errors.password}</span>
              )}
            </div>

            {/* Rol */}
            <div className="registerField">
              <label className="registerLabel">Tipo de Cuenta</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="registerSelect"
              >
                <option value="user">Usuario</option>
                <option value="vet">Veterinario</option>
              </select>
            </div>

            <button className="registerBtnSubmit glowBtnInverse" type="submit">
              Registrarse
            </button>
          </form>

          <p className="registerLoginLink">
            ¿Ya tienes una cuenta?{" "}
            <Link to="/login" className="registerLink">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Register;
