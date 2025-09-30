import React from 'react'

const items = [
  {name: 'Natalia', role: 'Fundadora de startup', text: 'Los testimonios son breves comentarios de las personas a quienes les encanta tu marca.'},
  {name: 'Julia', role: 'Empresaria', text: 'Son una buena forma de persuadir a los clientes para que prueben tus servicios.'},
  {name: 'Pedro', role: 'Emprendedor', text: 'Excelente experiencia con el proceso de adopción.'}
]

export default function Testimonials(){
  return (
    <section className="testimonials container">
      <h2 className="section-title">Usuarios de Zana satisfechos</h2>
      <div className="test-grid">
        {items.map(it => (
          <blockquote className="test" key={it.name}>
            <p>“{it.text}”</p>
            <footer>{it.name} — <span>{it.role}</span></footer>
          </blockquote>
        ))}
      </div>
    </section>
  )
}