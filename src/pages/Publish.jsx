import React, { useState } from 'react';
import { createPet } from '../services/apiClient.js';
import '../styles/Form.css';

const INITIAL_FORM = {
    name: '',
    type: 'perro',
    breed: '',
    age: '',
    location: '',
    imageUrl: '',
    description: '',
};

const Publish = () => {
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
            const payload = {
                ...formValues,
                age: Number(formValues.age) || 0,
            };

            await createPet(payload);
            setFeedback({ type: 'success', message: 'La mascota se publicó correctamente 🎉' });
            setFormValues(INITIAL_FORM);
        } catch (error) {
            setFeedback({ type: 'error', message: error.message || 'No se pudo publicar la mascota.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="form-page">
            <h1>Publicar una nueva mascota</h1>
            <p className="form-page__subtitle">
                Completa los datos de tu mascota para que más personas puedan conocerla y adoptarla.
            </p>

            <form className="form" onSubmit={handleSubmit}>
                <div className="form__row">
                    <label htmlFor="name">Nombre</label>
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
                    <label htmlFor="type">Tipo</label>
                    <select id="type" name="type" value={formValues.type} onChange={handleChange}>
                        <option value="perro">Perro</option>
                        <option value="gato">Gato</option>
                        <option value="ave">Ave</option>
                        <option value="otro">Otro</option>
                    </select>
                </div>

                <div className="form__row">
                    <label htmlFor="breed">Raza</label>
                    <input
                        id="breed"
                        name="breed"
                        type="text"
                        value={formValues.breed}
                        onChange={handleChange}
                    />
                </div>

                <div className="form__row">
                    <label htmlFor="age">Edad (años)</label>
                    <input
                        id="age"
                        name="age"
                        type="number"
                        min="0"
                        value={formValues.age}
                        onChange={handleChange}
                    />
                </div>

                <div className="form__row">
                    <label htmlFor="location">Ubicación</label>
                    <input
                        id="location"
                        name="location"
                        type="text"
                        value={formValues.location}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form__row">
                    <label htmlFor="imageUrl">URL de imagen</label>
                    <input
                        id="imageUrl"
                        name="imageUrl"
                        type="url"
                        value={formValues.imageUrl}
                        onChange={handleChange}
                        placeholder="https://misitio.com/mascota.jpg"
                    />
                </div>

                <div className="form__row">
                    <label htmlFor="description">Descripción</label>
                    <textarea
                        id="description"
                        name="description"
                        rows="4"
                        value={formValues.description}
                        onChange={handleChange}
                        placeholder="Cuenta un poco sobre su personalidad, cuidados, etc."
                    />
                </div>

                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Publicando…' : 'Publicar mascota'}
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
export default Publish;