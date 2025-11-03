import axios from 'axios';

// Asumimos que tu backend corre en el puerto 8080 (ajusta si es necesario)
const apiClient = axios.create({
  baseURL: 'http://localhost:8080', // Asegúrate que coincida con tu backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- API de Mascotas (basado en mascotaRoutes.js) ---
export const getMascotas = () => apiClient.get('/mascotas');
export const getMascotaById = (id) => apiClient.get(`/mascotas/${id}`);
export const createMascota = (data) => apiClient.post('/mascotas', data);
export const updateMascota = (id, data) => apiClient.put(`/mascotas/${id}`, data);
export const deleteMascota = (id) => apiClient.delete(`/mascotas/${id}`);

// --- API de Veterinarios (basado en veterinarioRoutes.js) ---
export const getVeterinarios = () => apiClient.get('/veterinarios');
export const getVeterinarioById = (id) => apiClient.get(`/veterinarios/${id}`);
export const createVeterinario = (data) => apiClient.post('/veterinarios', data);
export const updateVeterinario = (id, data) => apiClient.put(`/veterinarios/${id}`, data);
export const deleteVeterinario = (id) => apiClient.delete(`/veterinarios/${id}`);

// --- API de Especies (basado en especieRoutes.js) ---
export const getEspecies = () => apiClient.get('/especies');

// --- API de Usuarios (basado en usuarioRoutes.js) ---
export const getUsuarios = () => apiClient.get('/usuarios');

// ... Agrega aquí el resto de funciones para:
// - SolicitudesAdopcion
// - ConsultasVeterinarias
// - Patologias
// ...