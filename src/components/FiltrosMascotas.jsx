// src/components/FiltrosMascotas.jsx
import React from "react";

const FiltrosMascotas = ({ onChange }) => {
  return (
    <div className="filtros-mascotas">
      <h2>Filtros</h2>
      {/* Ejemplo de inputs, adaptá según tus filtros reales */}
      <label>
        Zona:
        <input type="text" onChange={(e) => onChange({ zona: e.target.value })} />
      </label>
      <label>
        Especie:
        <input type="text" onChange={(e) => onChange({ especie: e.target.value })} />
      </label>
    </div>
  );
};

export default FiltrosMascotas;
