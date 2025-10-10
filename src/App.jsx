import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Veterinary from './pages/Veterinary';
import Publish from './pages/Publish';
import Login from './pages/Login';
import Plans from './pages/Plans';
import './styles/App.css'; // Importa los estilos globales

const App = () => {
    return (
        <Router>
            <Header /> {/* Header se mantiene en todas las páginas */}
            <main>
                <Routes>
                    {/* VER LISTA MASCOTAS */}
                    <Route path="/" element={<Home />} /> 
                    
                    {/* CONSULTA VETERINARIO */}
                    <Route path="/veterinary" element={<Veterinary />} /> 
                    
                    {/* CREAR/PUBLICAR MASCOTA */}
                    <Route path="/publish" element={<Publish />} /> 
                    
                    {/* INICIAR SESION */}
                    <Route path="/login" element={<Login />} /> 
                    
                    {/* PLANES */}
                    <Route path="/plans" element={<Plans />} /> 
                    
                    {/* Podrías añadir una ruta para Solicitudes, Favoritos, etc. */}
                </Routes>
            </main>
            {/* Opcional: <Footer /> */}
        </Router>
    );
};

export default App;