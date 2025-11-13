// src/shared/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user") || "null"); } catch { return null; }
  });
  const [loading, setLoading] = useState(false);

  const login = (userObj, jwt) => {
    localStorage.setItem("token", jwt);
    localStorage.setItem("user", JSON.stringify(userObj));
    setToken(jwt);
    setUser(userObj);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  // Helpers de demo (podés quitarlos cuando tengas login real)
  const loginAsUser = () => login({ id: 1, name: "Usuario", role: "user" }, "demo-user");
  const loginAsVet  = () => login({ id: 2, name: "Veterinario", role: "vet" }, "demo-vet");

  useEffect(() => {
    // lugar para validar token con el backend si querés
  }, []);

  const value = useMemo(
    () => ({ token, user, login, logout, loginAsUser, loginAsVet, loading }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

/* ---------- Protecciones de ruta ---------- */

// Requiere sesión; si no hay user -> redirige a /login y guarda from
export function RequireAuth({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}

// Requiere un rol específico (por ejemplo "vet" o "user")
export function RequireRole({ role, children }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}
