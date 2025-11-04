// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Para redirigir
import { useAuth } from '../context/AuthContext'; // 2. Importamos el hook de Auth
import '../styles/Form.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedback, setFeedback] = useState(null);

    const { login } = useAuth(); // 3. Usamos la función 'login' del contexto
    const navigate = useNavigate(); // 4. Hook para navegar

    const handleSubmit = async (event) => {
        event.preventDefault();
        setFeedback(null);
        setIsSubmitting(true);

        try {
            await login({ email, password }); // 5. Llamamos a la función del contexto
            
            // 6. ¡Éxito! Redirigimos al inicio
            navigate('/'); 

        } catch (error) {
            setFeedback({ type: 'error', message: error.message || 'Email o contraseña incorrectos.' });
            setIsSubmitting(false);
        }
        // No necesitamos 'finally' porque la navegación saca al usuario de esta página
    };

    return (
        <div className="form-page">
            <h1>Iniciar Sesión</h1>
            <p className="form-page__subtitle">
                Ingresa a tu cuenta para gestionar tus mascotas.
            </p>

            <form className="form" onSubmit={handleSubmit}>
                <div className="form__row">
                    <label htmlFor="email">Correo electrónico</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="form__row">
                    <label htmlFor="password">Contraseña</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Ingresando...' : 'Iniciar Sesión'}
                </button>
            </form>

            {feedback && (
                <p className={`form-feedback ${feedback.type === 'error' ? 'error' : 'success'}`}>
                    {feedback.message}
                </p>
            )}
        </div>
    );
};

export default LoginPage;