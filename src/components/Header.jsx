import React from 'react';
import { Link } from 'react-router-dom';

import Navbar from './Navbar.jsx';
import '../styles/Header.css';

const Header = () => {
  return (
    <header className="main-header">
      <div className="header-content">

        {/* Logo */}
        <div className="header-brand">
          <Link to="/">
            PELUDITOS HOME 🏠 🐾
          </Link>
        </div>

        {/* SOLO el navbar */}
        <Navbar />

      </div>
    </header>
  );
};

export default Header;
