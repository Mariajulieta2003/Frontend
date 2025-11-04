// src/pages/Veterinary.jsx
import React, { useState, useEffect } from 'react';
import { getVeterinarios } from '../services/apiClient'; // 1. Importamos la API
import '../styles/Veterinary.css'; // (Asegúrate de tener este CSS)

const VeterinaryPage = () => {
    const [veterinarios, setVeterinarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVeterinarios = async () => {
            try {
                setLoading(true);
                const data = await getVeterinarios(); // 2. Llamamos a la API
                setVeterinarios(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchVeterinarios();
    }, []); // Se ejecuta solo una vez

    if (loading) return <p>Cargando veterinarios...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div className="veterinary-page">
            <h1>Nuestros Veterinarios</h1>
            <p>Profesionales asociados que cuidan de nuestras mascotas.</p>
            
            <div className="veterinary-list">
                {veterinarios.length > 0 ? (
                    veterinarios.map(vet => (
                        <article key={vet.id} className="vet-card">
                            <h3>{vet.nombre}</h3>
                            <p>Especialidad: {vet.especialidad || 'No especificada'}</p>
                            <p>Contacto: {vet.telefono || vet.email || 'No disponible'}</p>
                            <p>Ubicación: {vet.direccion || 'No disponible'}</p>
                        </article>
                    ))
                ) : (
                    <p>No hay veterinarios registrados por el momento.</p>
                )}
            </div>
        </div>
    );
};

export default VeterinaryPage;