import React, { useState } from 'react';
import { login } from '../services/apiClient.js';
import '../styles/Form.css';

const INITIAL_FORM = {
    email: '',
    password: '',
};

const Login = () => {
    const [formValues, setFormValues] = useState(INITIAL_FORM);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedback, setFeedback] = useState(null);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setFeedback(null);

        try {
            const session = await login(formValues);
            setFeedback({
                type: 'success',
                message: session?.token
                    ? 'Sesión iniciada correctamente.'
                    : 'Sesión iniciada correctamente. Guarda tu token de acceso.',
            });
            setFormValues(INITIAL_FORM);
        } catch (error) {
            setFeedback({ type: 'error', message: error.message || 'No se pudo iniciar sesión.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="form-page">
            <h1>Iniciar sesión</h1>
            <p className="form-page__subtitle">
                Ingresa con el correo y contraseña que registraste para acceder a tus mascotas publicadas.
            </p>

            <form className="form" onSubmit={handleSubmit}>
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
                        required
                    />
                </div>

                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Iniciando…' : 'Ingresar'}
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

export default Login;
