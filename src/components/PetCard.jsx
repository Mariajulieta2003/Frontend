import React from 'react';

// Se eliminó la importación de 'Link' porque no se estaba utilizando.

const FALLBACK_IMAGE = 'https://via.placeholder.com/300x200/cccccc/333333?text=Mascota';

const PetCard = ({ mascota }) => {
  // 1. Asumimos que las propiedades (name, location, etc.) vienen DENTRO del objeto 'mascota'.
  // La desestructuración original (id, edad...) no coincidía con lo que usaba el HTML.
  const { name, location, age, breed, description, imageUrl } = mascota;

  // 2. La función 'handleAdoptionRequest' debe definirse DENTRO del componente.
  const handleAdoptionRequest = (petName) => {
    alert(`Solicitud de adopción para ${petName} en proceso!`);
  };

  // 3. Se eliminó el cierre prematuro '};' que estaba aquí.

  return (
    // 4. Se reemplazó 'style={cardStyle}' (que no estaba definido) por un className.
    <article className="pet-card">
      <div className="pet-image-container">
        <img
          // 5. Se usan las propiedades desestructuradas de 'mascota'.
          src={imageUrl || FALLBACK_IMAGE}
          alt={`Foto de ${name}`}
          className="pet-image"
          loading="lazy"
        />
      </div>
      <div className="pet-info">
        <h3>{name}</h3>
        <p className="pet-meta">
          <span> {location || 'Ubicación desconocida'}</span>
          <span> {age ?? '—'} años</span>
        </p>
        {breed && <p className="pet-breed">Raza: {breed}</p>}
        {description && <p className="pet-description">{description}</p>}
        
        {/* 6. Se llama a la función 'handleAdoptionRequest' con el 'name' de la mascota. */}
        <button className="btn-secondary" onClick={() => handleAdoptionRequest(name)}>
          ¡Quiero Adoptar!
        </button>
      </div>
    </article>
  );
}; // Este es el cierre correcto del componente 'PetCard'.

export default PetCard;

