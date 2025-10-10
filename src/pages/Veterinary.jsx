//INTERFAZ PARA CONSULTAR LAS 24HS (VETERINARIO)
// Esto simulará la interfaz para la Consulta Veterinario 24h.

import React from 'react';

const Veterinary = () => {
    const handleConnect = () => {
        // Lógica para iniciar la conexión (WebSocket o chat API)
        alert("Conectando con un veterinario 24h... ¡Listo para el chat!");
    };

    return (
        <div className="veterinary-container" style={{ padding: '40px', textAlign: 'center' }}>
            <h1>Consulta Veterinaria 24 Horas 🩺</h1>
            <p style={{ margin: '20px auto', maxWidth: '600px' }}>
                Si tu mascota se encuentra enferma, conéctate inmediatamente con uno de nuestros veterinarios. 
                El servicio está disponible las 24 horas del día.
            </p>
            
            <button 
                className="btn-primary" 
                onClick={handleConnect}
                style={{ fontSize: '1.2rem', padding: '15px 30px' }}
            >
                INICIAR CONSULTA AHORA
            </button>
            
            <div style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                <h3>Recomendaciones de Uso</h3>
                <ul>
                    <li>Ten a mano los síntomas de tu mascota.</li>
                    <li>Este servicio no reemplaza una visita de emergencia, pero ofrece asesoría inmediata.</li>
                </ul>
            </div>
        </div>
    );
};

export default Veterinary;