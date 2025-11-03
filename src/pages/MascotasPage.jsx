// src/pages/MascotasPage.jsx (Corregido)
import React, { useState, useEffect } from 'react';
import ListadoMascotas from '../components/ListadoMascotas.jsx';
import FiltrosMascotas from '../components/FiltrosMascotas.jsx'; 
import { getMascotas } from "../services/apiClient.js";

function MascotasPage() {
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [, setFiltros] = useState({
    zona: '',
    especie: ''
  });

  useEffect(() => {
    const fetchMascotas = async () => {
      try {
        setLoading(true);
        const response = await getMascotas(); 
        setMascotas(response);
        setError(null);
      } catch (err) {
        setError('Error al cargar las mascotas. Intenta de nuevo más tarde.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMascotas();
  }, []);

  const handleFilterChange = (nuevosFiltros) => {
    setFiltros(nuevosFiltros);
    console.log("Filtros actualizados:", nuevosFiltros);
  };

  return (
    <div className="mascotas-page">
      <h1>Encuentra a tu nuevo amigo</h1>
      
      {/* Componente de Filtros */}
      <FiltrosMascotas onChange={handleFilterChange} />
      
      {/* Contenido principal */}
      {loading && <p className="loading-msg">Buscando mascotas...</p>}
      {error && <p className="error-msg">{error}</p>}
      {!loading && !error && (
        <ListadoMascotas mascotas={mascotas} />
      )}
    </div>
  );
}

export default MascotasPage;