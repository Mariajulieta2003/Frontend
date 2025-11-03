// src/App.jsx (Corregido)

import { BrowserRouter, Routes, Route } from 'react-router-dom';

// --- CORRECCIÓN AQUÍ: Añadimos .jsx a todas las importaciones ---
import Header from './components/Header.jsx';
import HomePage from './pages/HomePage.jsx';
import RegisterPage from './pages/RegisterPage.jsx'; // <-- El error estaba aquí
import LoginPage from './pages/LoginPage.jsx';
import MascotaDetalle from './pages/MascotaDetalle.jsx';
import MascotasPage from './pages/MascotasPage.jsx';
// -----------------------------------------------------------

function App() {
  return (
    <BrowserRouter>
      {/* El Header ahora es fijo y se muestra en TODAS las páginas */}
      <Header />
      
      {/* El 'main-container' da un poco de margen a todo el contenido */}
      <main className="main-container"> 
        <Routes>
          {/* --- RUTAS ACTUALIZADAS --- */}
          
          {/* Ruta Raíz: Muestra la nueva página de "Inicio" */}
          <Route path="/" element={<HomePage />} />
          
          {/* Ruta Mascotas: Muestra la lista y filtros */}
          <Route path="/mascotas" element={<MascotasPage />} />
          
          {/* Ruta Detalle: Muestra una sola mascota */}
          <Route path="/mascotas/:id" element={<MascotaDetalle />} />

          {/* Rutas de Autenticación */}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />

        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;