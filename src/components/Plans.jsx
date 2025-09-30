import React from 'react'

const plans = [
  {name: 'Básico', price: 'Gratis', bullets: ['Hasta 3 cuentas vinculadas', 'Hoja de tiempo']},
  {name: 'Pro', price: '$200/mes', bullets: ['Cuentas ilimitadas', 'Hoja de tiempo', 'Asistente inteligente']},
  {name: 'Pro Plus', price: '$1500/año', bullets: ['Todo incluido', 'Soporte prioritario']}
]

export default function Plans(){
  return (
    <section className="plans container">
      <h2 className="section-title">Planes</h2>
      <div className="plans-grid">
        {plans.map(p => (
          <div className="plan" key={p.name}>
            <h3>{p.name}</h3>
            <p className="price">{p.price}</p>
            <ul>
              {p.bullets.map(b => <li key={b}>{b}</li>)}
            </ul>
            <button className="btn primary">Seleccionar</button>
          </div>
        ))}
      </div>
    </section>
  )
}