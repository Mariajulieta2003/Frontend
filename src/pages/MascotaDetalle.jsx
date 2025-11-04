// src/pages/MascotaDetalle.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // 1. Importa useNavigate
import { getMascotaById } from '../services/apiClient.js';
import { useAuth } from '../context/AuthContext.jsx'; // 2. Importa el hook de Auth
import { crearSolicitudAdopcion } from '../services/apiClient.js'; // 3. Importa la API de adopción
import '../styles/MascotaDetalle.css'; 

const MascotaDetalle = () => {
  const [mascota, setMascota] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adoptMsg, setAdoptMsg] = useState(null); // Para feedback

  const { id: mascotaId } = useParams(); // Renombramos 'id' a 'mascotaId'
  const { user } = useAuth(); // 4. Obtenemos el usuario del contexto
  const navigate = useNavigate(); // 5. Hook para redirigir

  useEffect(() => {
    const fetchMascota = async () => {
      try {
        setLoading(true);
        const data = await getMascotaById(mascotaId); 
        setMascota(data);
        setError(null);
      } catch (err) {
        setError(`Error al cargar la mascota.`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMascota();
  }, [mascotaId]);

  // --- 6. Lógica del botón Adoptar ---
  const handleAdoptarClick = async () => {
    setAdoptMsg(null); // Limpiamos mensajes previos

    if (!user) {
      // REQUISITO CUMPLIDO: Si no hay usuario, lo mandamos al login
      alert("Debes iniciar sesión para poder adoptar.");
      navigate('/login');
      return;
    }

    // Si hay usuario, intentamos crear la solicitud
    try {
      const solicitudData = {
        idUsuario: user.id, // 'id' viene del payload del token
        idMascota: mascota.id
      };
      
      await crearSolicitudAdopcion(solicitudData);
      setAdoptMsg({ type: 'success', text: '¡Solicitud enviada! Pronto te contactarán.' });

    } catch (err) {
      console.error(err);
      setAdoptMsg({ type: 'error', text: err.message || 'No se pudo enviar la solicitud.' });
    }
  };

  // --- Renderizado ---
  if (loading) return <p className="detalle-loading">Cargando...</p>;
  if (error) return <p className="detalle-error">{error}</p>;
  if (!mascota) return <p>No se encontró la mascota.</p>;

  const { Especie, Usuario, Patologias, ...otrosDatos } = mascota;
  const FALLBACK_IMAGE = '...'; // tu fallback

  return (
    <div className="detalle-container">
      {/* ... (Todo tu JSX de la imagen y la info de la mascota) ... */}
      
      {/* ... (ul de info-list) ... */}
      
      {/* ... (Sección de Patologías) ... */}

      {/* --- 7. Botón Modificado --- */}
      <button 
        className="btn-adoptar" 
        onClick={handleAdoptarClick}
        disabled={adoptMsg?.type === 'success'} // Deshabilitar si ya la envió
      >
        ¡Quiero Adoptar a {Especie?.nombre || 'esta mascota'}!
      </button>
      
      {/* Mensaje de feedback */}
      {adoptMsg && (
        <p className={`adopt-feedback ${adoptMsg.type}`}>
          {adoptMsg.text}
        </p>
      )}

    </div>
  );
};

export default MascotaDetalle;