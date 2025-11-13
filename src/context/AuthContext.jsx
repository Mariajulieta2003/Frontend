import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

const AuthContext = createContext(null);

/**
 * Estructura esperada de user:
 * {
 *   id: string|number,
 *   name: string,
 *   email?: string,
 *   role?: 'user' | 'vet' | 'admin'   // si no viene, cae en 'guest'
 * }
 */

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user") || "null"); } catch { return null; }
  });
  const [loading, setLoading] = useState(false);

  // --- Derivados de estado ---
  const role = user?.role ?? "guest";
  const isAuthenticated = !!token && !!user;
  const isUser = role === "user";
  const isVet  = role === "vet";
  const isAdmin = role === "admin";

  // --- Login real (se mantiene tu firma actual) ---
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

  // --- Helpers de desarrollo / demo (podés borrarlos cuando conectes tu backend) ---
  const loginAsUser = () => {
    login({ id: 1, name: "Usuario", email: "user@demo.com", role: "user" }, "demo-token-user");
  };
  const loginAsVet = () => {
    login({ id: 2, name: "Veterinario", email: "vet@demo.com", role: "vet" }, "demo-token-vet");
  };

  // --- (Opcional) refrescar sesión / validar token al montar ---
  useEffect(() => {
    // Aquí podrías hacer un ping/refresh a tu backend si querés validar el token
    // setLoading(true); ... setLoading(false);
  }, []);

  // --- API pública del contexto ---
  const value = useMemo(() => ({
    token, user, role,
    isAuthenticated, isUser, isVet, isAdmin,
    login, logout,
    loginAsUser, loginAsVet,   // quitar si no querés botones demo
    loading, setLoading,
    hasRole: (roles) => Array.isArray(roles) ? roles.includes(role) : role === roles
  }), [token, user, role, isAuthenticated, isUser, isVet, isAdmin, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

/* ===========================
   Protecciones de Rutas (opcional)
   =========================== */

/** Requiere sesión iniciada */
export function RequireAuth({ children, redirectTo = "/login" }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  if (loading) return null;                 // podrías renderizar un spinner
  if (!isAuthenticated) return <Navigate to={redirectTo} replace state={{ from: location }} />;
  return children;
}

/** Requiere alguno de los roles indicados */
export function RequireRole({ roles = [], children, redirectTo = "/login" }) {
  const { isAuthenticated, hasRole, loading } = useAuth();
  const location = useLocation();
  if (loading) return null;
  if (!isAuthenticated || !hasRole(roles)) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }
  return children;
}
