// src/components/Mascota.jsx
import React from "react";

const Mascota = ({ mascota }) => {
  return (
    <div className="mascota-card">
      <h3>{mascota.nombre}</h3>
      <p>Especie: {mascota.especie}</p>
      <p>Zona: {mascota.zona}</p>
    </div>
  );
};

export default Mascota;
