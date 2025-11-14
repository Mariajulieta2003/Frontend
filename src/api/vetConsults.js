// src/api/vetConsults.js
import API from "./client.js";

// Crear consulta veterinaria
export const apiCreateVetConsult = async (data) => {
  const res = await API.post("/vet-consults", data);
  return res.data;
};

// Historial del usuario
export const apiGetMyVetConsults = async () => {
  const res = await API.get("/vet-consults/mine");
  return res.data;
};

// Cola del veterinario
export const apiGetConsultQueue = async () => {
  const res = await API.get("/vet-consults/queue");
  return res.data;
};

// Cambiar estado (pendiente → en_progreso → resuelta)
export const apiUpdateVetConsultStatus = async (id, payload) => {
  const res = await API.put(`/vet-consults/${id}/status`, payload);
  return res.data;
};
