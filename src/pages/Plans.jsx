import React from 'react';
import '../styles/Plans.css';

const Plans = () => {
    const plansData = [
        {
            name: 'Básico',
            price: 'Gratis',
            features: [
                'Una cuenta vinculada',
                'Opciones básicas',
                'Compatible con smartwatch',
            ],
            isFree: true,

        },
        {
            name: 'Pro',
            price: '$200/mes',
            features: [
                'Hasta 3 cuentas vinculadas',
                'Hoja de tiempo',
                'Conexión con otros dispositivos',
            ],

        },
        {

            name: 'Pro Plus',
            price: '$1500/año',
            features: [
                'Cuentas ilimitadas',
                'Hoja de tiempo',
                'Asistente inteligente',
                'Funciones intuitivas y recordatorios inteligentes',
            ],
        },
    ];

    return (
        <div className="plans-container">
            <h1>Planes de Servicio</h1>
            <p className="plans-subtitle">
                Gracias a nuestros planes, podés usar Zana como necesites.
            </p>
            <div className="plans-grid">
                {plansData.map((plan, index) => (
                    <div key={index} className={`plan-card ${plan.isFree ? 'free' : 'premium'}`}>
                        <h2>{plan.name}</h2>
                        <p className="plan-price">{plan.price}</p>
                        <hr />
                        <ul>
                            {plan.features.map((feature, idx) => (
                                <li key={idx}>{feature}</li>
                            ))}
                        </ul>
                        <button className={`btn-${plan.isFree ? 'primary' : 'secondary'}`}>
                            {plan.isFree ? 'Elegir Gratis' : 'Suscribirse'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
    


export default Plans;