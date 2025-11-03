// Ejemplo de cliente API
const API_URL = "http://localhost:3000"; // Cambiá según tu backend

export async function getMascotas() {
  const response = await fetch(`${API_URL}/mascotas`);
  if (!response.ok) {
    throw new Error("Error al obtener las mascotas");
  }
  return await response.json();
}

// Ejemplo adicional de POST
export async function crearMascota(data) {
  const response = await fetch(`${API_URL}/mascotas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Error al crear la mascota");
  }
  return await response.json();
}
