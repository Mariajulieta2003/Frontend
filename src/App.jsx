// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

// Guards
import { RequireAuth, RequireRole } from "./shared/context/AuthContext.jsx";

// Layout
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Páginas públicas
import HomePage from "./pages/HomePage/HomePage";
import Login from "./pages/Login/Login";
import RegisterUser from "./pages/Register/Register";
import PlanSelector from "./pages/PlanSelector/PlanSelector";
import VetPlansInfo from "./pages/PlanSelector/VetPlansInfo";
import DonatePage from "./pages/Donate/DonatePage";
import VolunteerPage from "./pages/Volunteer/VolunteerPage";
import ProfilePage from "./pages/Profile/ProfilePage";

// Import correcto de PLANS
import { PLANS } from "./data/PLANS";

// Páginas (usuario)
import UserHome from "./pages/UserHomePage";
import PetDetailPage from "./pages/PetsDetails/PetDetailPage";
import ApplyForAdoption from "./pages/Applications/ApplyForAdoption";
import MyPetsPage from "./pages/MyPets/MyPetsPage.jsx";
import PublishPetPage from "./pages/Publish/PublishPetPage";
import PurchasePage from "./pages/Purchase/PurchasePage";
import ReceivedRequestsPage from "./pages/Requests/ReceivedRequestsPage";
import MyRequestsPage from "./pages/Requests/MyRequestsPage";
import ContactVetPage from "./pages/ContactVet/ContactVetPage";
import MyVetConsultsPage from "./pages/Vet/MyVetConsultsPage.jsx";
import VetHistoryPage from "./pages/VetHistory/VetHistoryPage.jsx";

// Soporte y Vet
import SupportPage from "./pages/Support/SupportPage";
import VetQueue from "./pages/VetQueue/VetQueue";

export default function App() {
  return (
    <>
      <Navbar />
      <div className="nav-spacer" />

      <main className="app-main">
        <Routes>

          {/* ---------- RUTAS PÚBLICAS ---------- */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterUser />} />
          <Route path="/planes" element={<PlanSelector />} />
          <Route path="/planes/vet-info" element={<VetPlansInfo />} />

          {/* Donar / Voluntariado */}
          <Route path="/donar" element={<DonatePage />} />
          <Route path="/voluntariado" element={<VolunteerPage />} />

          {/* Compatibilidad */}
          <Route path="/donate" element={<Navigate to="/donar" replace />} />
          <Route path="/volunteer" element={<Navigate to="/voluntariado" replace />} />
          <Route path="/plans" element={<Navigate to="/planes" replace />} />

          {/* ---------- PERFIL ---------- */}
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <ProfilePage />
              </RequireAuth>
            }
          />

          {/* ---------- USUARIO ---------- */}
          <Route
            path="/pets"
            element={
              <RequireRole roles={["user"]}>
                <UserHome />
              </RequireRole>
            }
          />

          <Route
            path="/pets/:id"
            element={
              <RequireRole roles={["user"]}>
                <PetDetailPage />
              </RequireRole>
            }
          />

          <Route
            path="/pets/:id/apply"
            element={
              <RequireRole roles={["user"]}>
                <ApplyForAdoption />
              </RequireRole>
            }
          />

          <Route
            path="/purchase"
            element={
              <RequireRole roles={["user"]}>
                <PurchasePage plans={PLANS} />
              </RequireRole>
            }
          />

          <Route
            path="/my-pets"
            element={
              <RequireRole roles={["user"]}>
                <MyPetsPage />
              </RequireRole>
            }
          />

          <Route
            path="/publish"
            element={
              <RequireRole roles={["user"]}>
                <PublishPetPage />
              </RequireRole>
            }
          />

          <Route
            path="/incoming-requests"
            element={
              <RequireRole roles={["user"]}>
                <ReceivedRequestsPage />
              </RequireRole>
            }
          />

          <Route
            path="/my-requests"
            element={
              <RequireRole roles={["user"]}>
                <MyRequestsPage />
              </RequireRole>
            }
          />

          <Route
            path="/vet/contact"
            element={
              <RequireRole roles={["user"]}>
                <ContactVetPage />
              </RequireRole>
            }
          />

          {/* ---------- CONSULTAS Y HISTORIAL ---------- */}
          <Route
            path="/vet/consults"
            element={
              <RequireRole roles={["user"]}>
                <MyVetConsultsPage />
              </RequireRole>
            }
          />

          <Route
            path="/vet/history"
            element={
              <RequireRole roles={["user"]}>
                <VetHistoryPage />
              </RequireRole>
            }
          />

          {/* ---------- SOPORTE ---------- */}
          <Route
            path="/support"
            element={
              <RequireAuth>
                <SupportPage />
              </RequireAuth>
            }
          />

          {/* ---------- VETERINARIO ---------- */}
          <Route
            path="/vet/queue"
            element={
              <RequireRole roles={["vet"]}>
                <VetQueue />
              </RequireRole>
            }
          />

          {/* ---------- 404 ---------- */}
          <Route path="*" element={<div style={{ padding: 24 }}>Página no encontrada</div>} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}
