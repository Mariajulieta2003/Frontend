import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'; 
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import Footer from './components/Footer'; 

function App() {
  return (
    <BrowserRouter>
      <Navbar /> {/* El Navbar se muestra en todas las páginas */}
      <main>
        <Routes> {/* Define qué página mostrar según la URL */}
          <Route path="/" element={<HomePage />} />
          
          {/* Ruta temporal para que "Planes" no esté en blanco */}
          <Route path="/planes" element={
            <div className="page-section"><h1>Página de Planes</h1></div>
          } />
          {/* <Route path="/planes" element={<PlanesPage />} /> */}
        </Routes>
      </main>
      
      <Footer /> {/* <-- ¡AQUÍ ESTÁ LA LÍNEA QUE FALTABA! */}

    </BrowserRouter>
  );
}

export default App;
