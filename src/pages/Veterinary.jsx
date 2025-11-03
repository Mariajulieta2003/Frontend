import React from 'react';
 import '../styles/Veterinary.css';
 
 const Veterinary = () => {
     const handleConnect = () => {
         // Lógica para iniciar la conexión (WebSocket o chat API)
        alert('Conectando con un veterinario 24h... ¡Listo para el chat!');
     };
 
     return (
        <section className="veterinary-container">
             <h1>Consulta Veterinaria 24 Horas 🩺</h1>
            <p>
                Si tu mascota se encuentra enferma, conéctate inmediatamente con uno de nuestros veterinarios.
                 El servicio está disponible las 24 horas del día.
             </p>
            <button className="btn-primary" onClick={handleConnect}>
                Iniciar consulta ahora
             </button>

            <div className="veterinary-tips">
                 <h3>Recomendaciones de Uso</h3>
                 <ul>
                     <li>Ten a mano los síntomas de tu mascota.</li>
                     <li>Este servicio no reemplaza una visita de emergencia, pero ofrece asesoría inmediata.</li>
                 </ul>
             </div>
        </section>
     );
 };
 
export default Veterinary;