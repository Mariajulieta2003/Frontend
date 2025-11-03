// src/App.jsx (Corregido)

// src/App.jsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';

// --- Importamos los componentes de página ---
import Header from './components/Header.jsx';
import HomePage from './pages/HomePage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import MascotaDetalle from './pages/MascotaDetalle.jsx';
import MascotasPage from './pages/MascotasPage.jsx';
// (Asegúrate de tener también un Footer.jsx si lo usas)
// import Footer from './components/Footer.jsx';

function App() {
  return (
    <BrowserRouter>
      {/* El Header se muestra en TODAS las páginas */}
      <Header />
      
      <main className="main-container"> 
        <Routes>
          {/* Ruta Raíz */}
          <Route path="/" element={<HomePage />} />
          
          {/* Ruta Mascotas: Muestra la lista y filtros */}
          <Route path="/mascotas" element={<MascotasPage />} />
          
          {/* Ruta Detalle: Muestra una sola mascota */}
          <Route path="/mascotas/:id" element={<MascotaDetalle />} />

          {/* Rutas de Autenticación */}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Puedes añadir más rutas aquí (Veterinarios, Planes, etc.) */}

        </Routes>
      </main>

      {/* <Footer /> */}
    </BrowserRouter>
  );
}

export default App;