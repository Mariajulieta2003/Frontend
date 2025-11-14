// ✅ src/main.jsx — VERSIÓN DEFINITIVA SIN ERRORES

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

import { BrowserRouter } from "react-router-dom";   // ✅ ¡Debía usarse!
import "./index.css";

// ✅ Providers
import { AuthProvider } from "./shared/context/AuthContext.jsx";
import { PetsProvider } from "./shared/context/PetsContext.jsx";
import { MessageProvider } from "./shared/context/MessageContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>   {/* ✅ Ahora sí lo usamos */}
      <AuthProvider>
        <PetsProvider>
          <MessageProvider>
            <App />
          </MessageProvider>
        </PetsProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
