import React, { useState } from "react";
import { Send, HelpCircle, MessageSquare, Mail } from "lucide-react";
import "./styles/SupportPage.css";

export default function SupportPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      alert("Por favor completá todos los campos 🐾");
      return;
    }
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="supportContainer pagePadTop">
      <header className="supportHeader">
        <HelpCircle size={36} color="#00a884" />
        <div>
          <h1>Centro de Soporte</h1>
          <p>
            ¿Tenés alguna duda o problema? Estamos para ayudarte a vos y a tus
            peluditos 🐶🐱.
          </p>
        </div>
      </header>

      <section className="faqSection">
        <h2>Preguntas Frecuentes</h2>
        <div className="faqGrid">
          <div className="faqCard">
            <MessageSquare size={22} color="#00a884" />
            <h3>¿Cómo puedo publicar una mascota?</h3>
            <p>
              Ingresá en <strong>“Publicar”</strong> desde el menú principal,
              completá los datos de tu mascota y agregá fotos. Luego podés
              guardarla como borrador o publicarla.
            </p>
          </div>
          <div className="faqCard">
            <MessageSquare size={22} color="#00a884" />
            <h3>¿Qué hago si olvidé mi contraseña?</h3>
            <p>
              En la pantalla de inicio de sesión, hacé clic en{" "}
              <strong>“¿Olvidaste tu contraseña?”</strong> y seguí los pasos
              para recuperarla.
            </p>
          </div>
          <div className="faqCard">
            <MessageSquare size={22} color="#00a884" />
            <h3>¿Puedo modificar o eliminar una publicación?</h3>
            <p>
              Sí, desde <strong>“Mis Mascotas”</strong> podés editar o eliminar
              las publicaciones activas o pendientes.
            </p>
          </div>
        </div>
      </section>

      <section className="contactSection">
        <h2>¿Todavía necesitás ayuda?</h2>
        <p>
          Escribinos tu consulta y te responderemos a la brevedad. Amamos ayudar
          a quienes ayudan a los peluditos 💚.
        </p>

        <form className="supportForm" onSubmit={onSubmit}>
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="Tu nombre"
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            placeholder="Tu correo electrónico"
          />
          <textarea
            name="message"
            value={form.message}
            onChange={onChange}
            rows="5"
            placeholder="Escribí tu mensaje aquí..."
          ></textarea>
          <button type="submit" className="btn primary">
            <Send size={18} /> Enviar mensaje
          </button>
        </form>

        {submitted && (
          <div className="successMsg">
            <Mail size={18} /> ¡Gracias por tu mensaje! Te responderemos pronto.
          </div>
        )}
      </section>
    </div>
  );
}
