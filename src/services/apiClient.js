// src/services/apiClient.js
const API_URL = "http://localhost:3000"; // Cambiá según tu backend

/**
 * Obtiene TODAS las mascotas
 */
export async function getMascotas() {
  const response = await fetch(`${API_URL}/mascotas`);
  if (!response.ok) {
    throw new Error("Error al obtener las mascotas");
  }
  // Asumimos que tus rutas de mascotas devuelven { data: [...] }
  const result = await response.json();
  return result.data; 
}

/**
 * Obtiene UNA mascota por su ID
 */
export async function getMascotaById(id) {
  const response = await fetch(`${API_URL}/mascotas/${id}`);
  if (!response.ok) {
    throw new Error(`Error al obtener la mascota con ID: ${id}`);
  }
  // Asumimos que tus rutas de mascotas devuelven { data: {...} }
  const result = await response.json();
  return result.data;
}

/**
 * Registra un nuevo usuario
 */
export async function register(userData) {
  // Las rutas de usuario devuelven el objeto directamente
  const response = await fetch(`${API_URL}/usuarios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData), 
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Error al registrar el usuario");
  }
  
  return await response.json();
}

/**
 * Inicia sesión de un usuario
 * (¡Esta es la función que te faltaba!)
 */
export async function login(credentials) {
  // Haremos POST a /usuarios/login (lo crearemos en la Parte 2)
  const response = await fetch(`${API_URL}/usuarios/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials), // credentials es { email, password }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Email o contraseña incorrectos");
  }

  // Esperamos que devuelva un token
  return await response.json(); 
}