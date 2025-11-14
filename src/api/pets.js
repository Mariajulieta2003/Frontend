// src/api/pets.js
import apiClient from "./Client";

// Mascotas públicas (listado general)
export const apiGetPets = async () => {
  const res = await apiClient.get("/pets");
  return res.data;
};

// Mis mascotas (por ownerId)
export const apiGetMyPets = async (ownerId) => {
  const res = await apiClient.get("/pets/mine", {
    params: { ownerId },
  });
  return res.data;
};

// Cambiar estado (publicado/pausado/etc.)
export const apiUpdatePetStatus = async (id, status) => {
  const res = await apiClient.patch(`/pets/${id}/status`, { status });
  return res.data;
};

// Eliminar publicación
export const apiDeletePet = async (id) => {
  const res = await apiClient.delete(`/pets/${id}`);
  return res.data;
};

// (opcional para editar en el futuro)
export const apiGetPetById = async (id) => {
  const res = await apiClient.get(`/pets/${id}`);
  return res.data;
};
