// src/pages/MascotasPage.jsx
import React from 'react';
import ListadoMascotas from '../components/ListadoMascotas';
// import FiltrosMascotas from '../components/FiltrosMascotas'; // Descomenta si tienes este componente
import '../styles/PetList.css'; // Importamos el CSS de la lista

const MascotasPage = () => {
  return (
    <div className="mascotas-page-container">
      <h1>Encuentra a tu nuevo compañero</h1>
      <p>Filtra y busca entre todas las mascotas que esperan un hogar.</p>
      
      {/* <FiltrosMascotas /> */} 
      
      <hr />
      
      <ListadoMascotas />
    </div>
  );
};

export default MascotasPage;