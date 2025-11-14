import axios from "axios";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:3001/api")
  .replace(/\/+$/, ""); // elimina slashes finales

export async function apiGetMyProfile() {
  const token = localStorage.getItem("ph_token");
  const res = await axios.get(`${API_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function apiUpdateProfile(data) {
  const token = localStorage.getItem("ph_token");
  const res = await axios.put(`${API_URL}/users/me`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}
