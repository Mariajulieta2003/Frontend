// src/api/auth.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export async function apiLogin({ email, password }) {
  try {
    const res = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });
    return res.data; // { token, user }
  } catch (err) {
    throw err.response?.data || { message: "Error de conexión" };
  }
}

export async function apiRegister({ full_name, email, password, role = "user" }) {
  try {
    const res = await axios.post(`${API_URL}/auth/register`, {
      full_name,
      email,
      password,
      role,
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Error de conexión" };
  }
}
