//TARJETA REUTILIZABLE PARA CADA MASCOTA

import React from 'react';
import '../styles/PetCard.css';

const PetCard = ({ pet }) => {
    const handleAdoptionRequest = (petName) => {
        // Lógica para enviar la solicitud de adopción (ej. POST a /api/solicitudes)
        alert(`Solicitud de adopción para ${petName} en proceso!`);
    };

    return (
        <div className="pet-card">
            <div className="pet-image-container">
                <img 
                    src={pet.imageUrl || 'placeholder.jpg'} 
                    alt={`Foto de ${pet.name}`} 
                    className="pet-image" 
                />
            </div>
            <div className="pet-info">
                <h3>{pet.name}</h3>
                <p>📍 {pet.location} · 🎂 {pet.age} años</p>
                <p className="pet-breed">Raza: {pet.breed}</p>
                <button 
                    className="btn-secondary"
                    onClick={() => handleAdoptionRequest(pet.name)}
                >
                    ¡Quiero Adoptar!
                </button>
            </div>
        </div>
    );
};

export default PetCard;