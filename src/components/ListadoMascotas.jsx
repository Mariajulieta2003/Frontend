// src/components/ListadoMascotas.jsx
import React, { useState, useEffect } from 'react';
import { getMascotas } from '../services/apiClient.js'; // ¡Importación correcta!
import PetCard from './PetCard.jsx'; // ¡Usamos el componente unificado!
import '../styles/PetList.css'; // (Asegúrate de crear este archivo CSS)

const ListadoMascotas = () => {
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMascotas = async () => {
      try {
        setLoading(true);
        const data = await getMascotas(); // La API ya devuelve el array
        setMascotas(data);
        setError(null);
      } catch (err) {
        setError('Error al cargar las mascotas.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMascotas();
  }, []); // Se ejecuta solo una vez al montar

  if (loading) {
    return <p>Cargando mascotas...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="pet-list-container">
      {mascotas.length > 0 ? (
        mascotas.map((mascota) => (
          // Pasamos el objeto 'mascota' completo a PetCard
          <PetCard key={mascota.id} mascota={mascota} />
        ))
      ) : (
        <p>No hay mascotas disponibles en este momento.</p>
      )}
    </div>
  );
};

export default ListadoMascotas;