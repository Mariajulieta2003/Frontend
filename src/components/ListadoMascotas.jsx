// src/components/ListadoMascotas.jsx (Corregido)

import React from 'react';

// --- ¡¡LA CORRECCIÓN ESTÁ AQUÍ!! ---
// Asegúrate de que esta línea importe 'Mascota.jsx'
import Mascota from './Mascota.jsx';
// ------------------------------------

import '../styles/PetList.css'; 

const ListadoMascotas = ({ mascotas }) => {
  if (!mascotas || mascotas.length === 0) {
    return <p>No hay mascotas disponibles para adopción.</p>;
  }

  return (
    // Usamos la clase para la grilla
    <div className="pet-list-grid"> 
      {mascotas.map(mascota => (
        <Mascota key={mascota.id} mascota={mascota} />
      ))}
    </div>
  );
};

export default ListadoMascotas;