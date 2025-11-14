// src/api/plans.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export async function apiSubscribeToPlan(plan_id) {
  try {
    const token = localStorage.getItem("ph_token");

    const res = await axios.post(
      `${API_URL}/plans/subscribe`,
      { plan_id },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Error al suscribirse" };
  }
}

export async function apiGetMySubscription() {
  try {
    const token = localStorage.getItem("ph_token");

    // ⚠ CORREGIDO: "my" en lugar de "mine"
    const res = await axios.get(`${API_URL}/plans/my`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  } catch (err) {
    return null;
  }
}
