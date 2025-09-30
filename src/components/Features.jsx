import React from 'react'

const Feature = ({title, children}) => (
  <div className="feature">
    <h4>{title}</h4>
    <p>{children}</p>
  </div>
)

export default function Features(){
  return (
    <section className="features container">
      <h2 className="section-title">Beneficios</h2>
      <div className="features-grid">
        <Feature title="Compatible con smartwatch">Sincroniza recordatorios y monitoreo desde tu reloj.</Feature>
        <Feature title="Conexión con otros dispositivos">Controla historiales y certificados digitales.</Feature>
        <Feature title="Funciones intuitivas">Diseño pensado para que cualquier usuario lo use fácilmente.</Feature>
      </div>
    </section>
  )
}