// src/context/AuthContext.jsx

import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode'; // Instala esto: npm install jwt-decode
import { login as apiLogin, register as apiRegister } from '../services/apiClient';

// 1. Creamos el Contexto
const AuthContext = createContext();

// 2. Creamos el "Proveedor" (el que maneja la lógica)
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Al cargar la app, revisa si hay un token válido en localStorage
    if (token) {
      try {
        const decodedUser = jwtDecode(token); // Decodificamos el token
        setUser(decodedUser); // Guardamos los datos del usuario
      } catch (error) {
        console.error("Token inválido o expirado", error);
        localStorage.removeItem('token'); // Limpiamos el token malo
        setToken(null);
      }
    }
    setLoading(false);
  }, [token]);

  // --- Funciones de Autenticación ---

  const login = async (credentials) => {
    // Llamamos a la API que ya creamos
    const data = await apiLogin(credentials); // data = { token: '...' }
    
    // Guardamos el token
    localStorage.setItem('token', data.token);
    setToken(data.token);
    
    // Decodificamos y guardamos al usuario
    const decodedUser = jwtDecode(data.token);
    setUser(decodedUser);
  };

  const register = async (userData) => {
    // Llamamos a la API de registro
    // Esta API (por ahora) solo devuelve el usuario creado, no un token.
    // Lo ideal sería que el backend también devuelva un token al registrar.
    await apiRegister(userData);
    // (Opcional: podrías llamar a login() aquí automáticamente)
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // 3. Pasamos los valores al resto de la app
  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// 4. Creamos un "hook" para usar el contexto fácilmente
export const useAuth = () => {
  return useContext(AuthContext);
};