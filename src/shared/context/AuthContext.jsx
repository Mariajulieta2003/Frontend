import React, { createContext, useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(null); // contiene { user, token }
  const [loading] = useState(false);

  // ----------------------------
  // CARGAR DATOS DESDE LOCALSTORAGE
  // ----------------------------
  useEffect(() => {
    const saved = localStorage.getItem("ph_user");
    if (saved) {
      setAuth(JSON.parse(saved)); // {user, token}
    }
  }, []);

  // ----------------------------
  // LOGIN
  // ----------------------------
  const login = (data) => {
    // data = { user: {...}, token: "...." }
    const authData = {
      user: data.user,
      token: data.token,
    };

    localStorage.setItem("ph_user", JSON.stringify(authData));
    setAuth(authData);
  };

  // ----------------------------
  // LOGOUT
  // ----------------------------
  const logout = () => {
    localStorage.removeItem("ph_user");
    setAuth(null);
  };

  // ----------------------------
  // ACTUALIZAR SUSCRIPCIÓN
  // ----------------------------
  const updateSubscription = (subscription) => {
    setAuth((prev) => {
      const updated = {
        ...prev,
        user: { ...prev.user, subscription },
      };
      localStorage.setItem("ph_user", JSON.stringify(updated));
      return updated;
    });
  };

  // ----------------------------
  // PROVIDER
  // ----------------------------
  return (
    <AuthContext.Provider
      value={{
        user: auth?.user || null,
        token: auth?.token || null,
        loading,
        login,
        logout,
        updateSubscription,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ======================================================
// GUARD: SOLO LOGUEADOS
// ======================================================
export function RequireAuth({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

// ======================================================
// GUARD: SOLO POR ROLES
// ======================================================
export function RequireRole({ roles, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}
