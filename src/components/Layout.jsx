import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className="layout">
      <Navbar />
      <main className="layout-content">
        {/* Outlet renderiza el componente de la ruta actual */}
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;