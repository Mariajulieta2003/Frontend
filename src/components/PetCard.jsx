// src/components/PetCard.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Importamos Link para la navegación
import '../styles/PetCard.css'; // (Asegúrate de crear este archivo CSS)

const FALLBACK_IMAGE = 'https://via.placeholder.com/300x200/cccccc/333333?text=Mascota';

const PetCard = ({ mascota }) => {
  
  // 1. Usamos la estructura de datos correcta (la de tu backend)
  const { id, edad, imageUrl, Especie, Usuario } = mascota;

  // 2. Usamos ?? para poner valores por defecto si algo viene null
  const nombreMascota = Especie?.nombre || 'Mascota';
  const imagen = imageUrl || FALLBACK_IMAGE;
  const publicador = Usuario?.nombre || 'Anónimo';

  return (
    // 3. Envolvemos toda la tarjeta en un Link que lleva al detalle
    <Link to={`/mascotas/${id}`} className="pet-card-link">
      <article className="pet-card">
        
        <div className="pet-image-container">
          <img
            src={imagen}
            alt={`Foto de ${nombreMascota}`}
            className="pet-image"
            loading="lazy"
          />
        </div>

        <div className="pet-info">
          <h3>{nombreMascota}</h3>
          
          <p className="pet-meta">
            <span>Publicado por: {publicador}</span>
            <span>{edad ?? '?'} años</span>
          </p>

          <span className="btn-ver-mas">
            Ver Detalles
          </span>
        </div>

      </article>
    </Link>
  );
};

export default PetCard;