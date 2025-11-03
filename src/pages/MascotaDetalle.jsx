import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMascotaById } from '../services/apiClient.js'; // Importamos la función de la API
import '../styles/MascotaDetalle.css'; // Crearemos este archivo para los estilos

const MascotaDetalle = () => {
  const [mascota, setMascota] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Obtenemos el 'id' de la URL
  const { id } = useParams();

  useEffect(() => {
    // 2. Función para cargar los datos de UNA mascota
    const fetchMascota = async () => {
      try {
        setLoading(true);
        const response = await getMascotaById(id);
        setMascota(response.data);
        setError(null);
      } catch (err) {
        setError(`Error al cargar la mascota. (ID: ${id})`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMascota();
  }, [id]); // Se ejecuta cada vez que el 'id' de la URL cambie

  // --- Renderizado Condicional ---

  if (loading) {
    return <p className="detalle-loading">Cargando detalles de la mascota...</p>;
  }

  if (error) {
    return <p className="detalle-error">{error}</p>;
  }

  if (!mascota) {
    return <p>No se encontró la mascota.</p>;
  }

  // --- Renderizado Principal ---

  // Tu backend devuelve la Especie, Usuario (quien publicó) y Patologias
  const { edad, compatibleNiños, compatibleMascotas, vacunas, castrado, Especie, Usuario, Patologias } = mascota;

  const FALLBACK_IMAGE = 'https://via.placeholder.com/600x400/cccccc/333333?text=Mascota';

  return (
    <div className="detalle-container">
      <div className="detalle-card">
        
        {/* Columna de Imagen */}
        <div className="detalle-imagen-col">
          <img 
            src={mascota.imageUrl || FALLBACK_IMAGE} 
            alt={`Foto de ${Especie?.nombre || 'mascota'}`} 
            className="detalle-imagen"
          />
        </div>

        {/* Columna de Información */}
        <div className="detalle-info-col">
          <h1>{Especie?.nombre || 'Mascota adorable'}</h1>
          <p className="publicado-por">
            Publicado por: <strong>{Usuario?.nombre || 'Usuario anónimo'}</strong>
          </p>

          <hr />

          <h2>Información Clave</h2>
          <ul className="info-list">
            <li><strong>Edad:</strong> {edad ?? 'No especificada'} años</li>
            <li><strong>Especie:</strong> {Especie?.nombre || 'No especificada'}</li>
            <li><strong>Vacunas:</strong> {vacunas || 'No especificado'}</li>
            <li><strong>Castrado:</strong> {castrado ? 'Sí' : 'No'}</li>
            <li><strong>Compatible con niños:</strong> {compatibleNiños ? 'Sí' : 'No'}</li>
            <li><strong>Compatible con otras mascotas:</strong> {compatibleMascotas ? 'Sí' : 'No'}</li>
          </ul>

          {/* Sección de Patologías (si existen) */}
          {Patologias && Patologias.length > 0 && (
            <>
              <h2>Consideraciones Médicas</h2>
              <ul className="patologias-list">
                {Patologias.map(patologia => (
                  <li key={patologia.id}>{patologia.observacion}</li>
                ))}
              </ul>
            </>
          )}

          {/* Botón de Adopción */}
          <button className="btn-adoptar">
            ¡Quiero Adoptar a {Especie?.nombre || 'esta mascota'}!
          </button>
        </div>
      </div>
    </div>
  );
};

export default MascotaDetalle;