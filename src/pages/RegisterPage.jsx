import React, { useState } from 'react';
import { register } from '../services/apiClient.js';
import '../styles/Form.css';


const INITIAL_FORM = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
};

const Register = () => {
    const [formValues, setFormValues] = useState(INITIAL_FORM);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedback, setFeedback] = useState(null);

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
                name: formValues.name,
                email: formValues.email,
                password: formValues.password,
            });
            setFeedback({
                type: 'success',
                message: 'Cuenta creada correctamente. Ya puedes iniciar sesión.',
            });
            setFormValues(INITIAL_FORM);
        } catch (error) {
            setFeedback({ type: 'error', message: error.message || 'No se pudo crear la cuenta.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="form-page">
            <h1>Crear cuenta</h1>
            <p className="form-page__subtitle">
                Completa tus datos para crear una cuenta y gestionar tus publicaciones de mascotas.
            </p>

            <form className="form" onSubmit={handleSubmit}>
                <div className="form__row">
                    <label htmlFor="name">Nombre completo</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={formValues.name}
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
                    {isSubmitting ? 'Creando cuenta…' : 'Registrarme'}
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

export default Register;