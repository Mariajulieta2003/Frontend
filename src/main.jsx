// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import './styles/Header.css';    // Ya lo tenías
import './styles/PetList.css';  // Ya lo tenías
import './styles/Filtros.css';  // <-- Nuevo
import './styles/HomePage.css'; // <-- Nuevo
// (Asegúrate de tener también el de MascotaDetalle.css)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)