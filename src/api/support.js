// src/api/support.js
import { apiClient } from "./Client.js";

/**
 * Crear ticket de soporte (usuario)
 */
export async function apiCreateSupportTicket(payload) {
  // payload: { subject, message }
  return apiClient("/support", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Tickets del usuario actual
 */
export async function apiGetMySupportTickets() {
  return apiClient("/support/my");
}

/**
 * Tickets recibidos (panel admin / soporte)
 */
export async function apiGetIncomingSupportTickets() {
  return apiClient("/support/incoming");
}

/**
 * Actualizar estado de un ticket
 */
export async function apiUpdateSupportTicketStatus(id, status) {
  return apiClient(`/support/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
