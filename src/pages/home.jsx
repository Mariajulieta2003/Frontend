//LISTA DE MASCOTAS (VER LISTA DE MASCOTAS)
// Esqueleto con filtros y la lista de tarjetas. Aquí es donde usarás tus endpoints de backend.

import React, { useState, useEffect } from 'react';
import PetCard from '../components/PetCard';
import '../styles/Home.css';

const Home = () => {
    // ESTADO: Almacena la lista de mascotas
    const [pets, setPets] = useState([]); 
    
    // ESTADO: Almacena los filtros seleccionados
    const [filters, setFilters] = useState({ type: '', location: '' });

    useEffect(() => {
        const fetchPets = async () => {
            // EJEMPLO DE CONEXIÓN CON TU BACKEND EN JAVASCRIPT:
            // Asegúrate de cambiar 'http://localhost:3001' por tu URL real
            const url = `http://localhost:3001/api/pets?type=${filters.type}&location=${filters.location}`;
            
            try {
                const response = await fetch(url);
                const data = await response.json();
                
                // setPets(data); // Usa esto cuando conectes con tu backend

                // Datos de prueba para que se vea algo al principio:
                setPets([
                    { id: 1, name: 'Max', type: 'perro', breed: 'Golden Retriever', age: 3, location: 'CABA', imageUrl: 'https://via.placeholder.com/300x200/9b59b6/ffffff?text=Perro+Max' },
                    { id: 2, name: 'Luna', type: 'gato', breed: 'Siames', age: 1, location: 'Buenos Aires', imageUrl: 'https://via.placeholder.com/300x200/f1c40f/ffffff?text=Gato+Luna' },
                    { id: 3, name: 'Tobby', type: 'perro', breed: 'Labrador', age: 5, location: 'Córdoba', imageUrl: 'https://via.placeholder.com/300x200/34495e/ffffff?text=Perro+Tobby' },
                ]);
            } catch (error) {
                console.error("Error al cargar mascotas:", error);
            }
        };

        fetchPets();
    }, [filters]); // Recarga cada vez que cambian los filtros

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <div className="home-container">
            <h1 className="page-title">Encuentra a tu nuevo mejor amigo 🐶🐱</h1>
            
            {/* BARRA DE FILTROS */}
            <div className="filters-bar">
                <select name="type" onChange={handleFilterChange} value={filters.type}>
                    <option value="">Filtrar por Tipo</option>
                    <option value="perro">Perro</option>
                    <option value="gato">Gato</option>
                </select>
                
                <input
                    type="text"
                    name="location"
                    placeholder="Filtrar por Ubicación..."
                    onChange={handleFilterChange}
                    value={filters.location}
                />
            </div>

            {/* GRILLA DE MASCOTAS */}
            <div className="pets-grid">
                {pets.length > 0 ? (
                    pets.map(pet => (
                        <PetCard key={pet.id} pet={pet} />
                    ))
                ) : (
                    <p>No se encontraron mascotas con esos criterios. ¡Intenta otros filtros!</p>
                )}
            </div>
        </div>
    );
};

export default Home;