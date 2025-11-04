// src/services/apiClient.js
const API_URL = "http://localhost:3000";

// --- Helper para obtener el Token ---
// Esta función nos ayudará a enviar el token en las peticiones protegidas
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error("No autenticado. Inicia sesión.");
  }
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}` // El estándar de JWT
  };
};

// --- Funciones de Autenticacion ---

export async function login(credentials) {
  const response = await fetch(`${API_URL}/usuarios/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Email o contraseña incorrectos");
  }
  return await response.json(); // Devuelve { token: '...' }
}

export async function register(userData) {
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

// --- Funciones de MASCOTAS (CRUD) ---

export async function getMascotas() {
  const response = await fetch(`${API_URL}/mascotas`);
  if (!response.ok) throw new Error("Error al obtener las mascotas");
  const result = await response.json();
  return result.data; // Tu backend devuelve { data: [...] }
}

export async function getMascotaById(id) {
  const response = await fetch(`${API_URL}/mascotas/${id}`);
  if (!response.ok) throw new Error(`Error al obtener la mascota ${id}`);
  const result = await response.json();
  return result.data; // Tu backend devuelve { data: {...} }
}

export async function crearMascota(data) {
  const response = await fetch(`${API_URL}/mascotas`, {
    method: "POST",
    headers: getAuthHeaders(), // ¡Requiere autenticación!
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Error al crear la mascota");
  return await response.json();
}

export async function updateMascota(id, data) {
  const response = await fetch(`${API_URL}/mascotas/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(), // ¡Requiere autenticación!
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Error al actualizar la mascota");
  return await response.json();
}

export async function deleteMascota(id) {
  const response = await fetch(`${API_URL}/mascotas/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(), // ¡Requiere autenticación!
  });
  if (!response.ok) throw new Error("Error al eliminar la mascota");
  return await response.json();
}


// --- Funciones de VETERINARIOS (CRUD) ---

export async function getVeterinarios() {
  const response = await fetch(`${API_URL}/veterinarios`);
  if (!response.ok) throw new Error("Error al obtener los veterinarios");
  return await response.json();
}

export async function createVeterinario(data) {
  const response = await fetch(`${API_URL}/veterinarios`, {
    method: "POST",
    headers: getAuthHeaders(), // ¡Requiere autenticación!
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Error al crear el veterinario");
  return await response.json();
}
// (Puedes añadir updateVeterinario y deleteVeterinario aquí...)


// --- Funciones de ADOPCION (Protegida) ---

export async function crearSolicitudAdopcion(data) {
  const response = await fetch(`${API_URL}/solicitudes-adopcion`, {
    method: "POST",
    headers: getAuthHeaders(), // ¡Requiere autenticación!
    body: JSON.stringify(data), // data será { idUsuario, idMascota }
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Error al crear la solicitud");
  }
  return await response.json();
}

// --- Funciones de ESPECIES ---

export async function getEspecies() {
  const response = await fetch(`${API_URL}/especies`); // Tu backend ya tiene esta ruta
  if (!response.ok) {
    throw new Error("Error al obtener las especies");
  }
  return await response.json();
}

// --- Funciones de PLANES (Versión corregida) ---

export async function getPlanes() {
  // Esta ruta ya la creamos en el backend
  const response = await fetch(`${API_URL}/planes`);
  if (!response.ok) {
    throw new Error("Error al obtener los planes");
  }
  return await response.json(); // Devuelve el array de planes
}