// src/components/FiltrosMascotas.jsx

import React, { useState } from 'react';
import '../styles/Filtros.css'; // <-- Importamos CSS para los filtros

const FiltrosMascotas = ({ onChange }) => {
  const [zona, setZona] = useState('');
  const [especie, setEspecie] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onChange({ zona, especie });
  };

  return (
    <form className="filtros-container" onSubmit={handleSubmit}>
      <div className="filtro-item">
        <label htmlFor="zona">📍 ¿Dónde estás?</label>
        <input 
          type="text" 
          id="zona"
          placeholder="Ej: Arrecifes, Buenos Aires"
          value={zona}
          onChange={(e) => setZona(e.target.value)}
        />
      </div>
      
      <div className="filtro-item">
        <label htmlFor="especie">🐶 ¿Qué buscas?</label>
        <select 
          id="especie"
          value={especie}
          onChange={(e) => setEspecie(e.target.value)}
        >
          <option value="">Todas las especies</option>
          <option value="Perro">Perro</option>
          <option value="Gato">Gato</option>
          <option value="Otro">Otro</option>
        </select>
      </div>

      <button type="submit" className="filtro-boton">Buscar</button>
    </form>
  );
};

export default FiltrosMascotas;