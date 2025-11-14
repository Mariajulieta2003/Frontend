// Frontend/src/api/donations.js
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

function authHeaders() {
  const token = localStorage.getItem("ph_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Crear donación
export async function apiCreateDonation({ amount, frequency, method, message }) {
  const res = await fetch(`${API_URL}/donations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({ amount, frequency, method, message }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error al registrar la donación");
  }

  return res.json();
}

// Obtener mis donaciones
export async function apiGetMyDonations() {
  const res = await fetch(`${API_URL}/donations/my`, {
    headers: {
      ...authHeaders(),
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error al obtener tus donaciones");
  }

  return res.json();
}
