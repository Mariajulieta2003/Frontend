// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Importamos para redirigir
import { useAuth } from '../context/AuthContext'; // 2. Importamos el hook de Auth
import '../styles/Form.css';

const INITIAL_FORM = {
    nombre: '', // Tu backend espera 'nombre'
    email: '',
    password: '',
    confirmPassword: '',
};

const RegisterPage = () => {
    const [formValues, setFormValues] = useState(INITIAL_FORM);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedback, setFeedback] = useState(null);

    const { register } = useAuth(); // 3. Usamos la función 'register' del contexto
    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setFeedback(null);

        if (formValues.password !== formValues.confirmPassword) {
            setFeedback({ type: 'error', message: 'Las contraseñas no coinciden.' });
            return;
        }

        setIsSubmitting(true);

        try {
            await register({
                nombre: formValues.nombre,
                email: formValues.email,
                password: formValues.password,
            });
            
            setFeedback({
                type: 'success',
                message: 'Cuenta creada correctamente. Serás redirigido al login.',
            });

            // 4. Éxito: Esperamos 2 segundos y redirigimos al login
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (error) {
            setFeedback({ type: 'error', message: error.message || 'No se pudo crear la cuenta.' });
            setIsSubmitting(false);
        }
    };

    return (
        <div className="form-page">
            <h1>Crear cuenta</h1>
            {/* ... (resto de tu JSX, solo asegúrate de que el input de 'name' tenga name="nombre") ... */}
            
            <form className="form" onSubmit={handleSubmit}>
                <div className="form__row">
                    <label htmlFor="nombre">Nombre completo</label>
                    <input
                        id="nombre"
                        name="nombre" // 5. Asegúrate que sea 'nombre'
                        type="text"
                        value={formValues.nombre}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form__row">
                    <label htmlFor="email">Correo electrónico</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={formValues.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form__row">
                    <label htmlFor="password">Contraseña</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={formValues.password}
                        onChange={handleChange}
                        minLength={6}
                        required
                    />
                </div>

                <div className="form__row">
                    <label htmlFor="confirmPassword">Confirmar contraseña</label>
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formValues.confirmPassword}
                        onChange={handleChange}
                        minLength={6}
                        required
                    />
                </div>

                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Creando cuenta...' : 'Registrarme'}
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

export default RegisterPage;