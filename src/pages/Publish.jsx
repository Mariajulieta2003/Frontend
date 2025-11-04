// src/pages/Publish.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { crearMascota, getEspecies } from '../services/apiClient';
import '../styles/Form.css'; // Usamos los mismos estilos de Form

const PublishPage = () => {
    const [especies, setEspecies] = useState([]);
    const [formValues, setFormValues] = useState({
        // El backend espera estos campos
        edad: '',
        vacunas: '',
        castrado: false,
        compatibleNiños: false,
        compatibleMascotas: false,
        imageUrl: '',
        idEspecie: '',
        // idUsuario se saca del token
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedback, setFeedback] = useState(null);

    const { user } = useAuth(); // Para obtener el id del usuario
    const navigate = useNavigate();

    // 1. Cargar especies al montar la página
    useEffect(() => {
        const loadEspecies = async () => {
            try {
                const data = await getEspecies();
                setEspecies(data);
            } catch (error) {
                setFeedback({ type: 'error', message: 'No se pudieron cargar las especies.' });
            }
        };
        loadEspecies();
    }, []);

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setFormValues((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    // 2. Manejar el envío
    const handleSubmit = async (event) => {
        event.preventDefault();
        setFeedback(null);

        if (!user) {
            setFeedback({ type: 'error', message: 'Debes iniciar sesión para publicar.' });
            return;
        }
        if (!formValues.idEspecie) {
            setFeedback({ type: 'error', message: 'Por favor, selecciona una especie.' });
            return;
        }

        setIsSubmitting(true);

        try {
            const dataParaEnviar = {
                ...formValues,
                idUsuario: user.id, // Añadimos el ID del usuario logueado
                // Convertimos a números/booleanos donde sea necesario
                edad: parseInt(formValues.edad, 10),
                idEspecie: parseInt(formValues.idEspecie, 10),
            };

            await crearMascota(dataParaEnviar); // 3. Llamamos a la API
            
            setFeedback({ type: 'success', message: '¡Mascota publicada con éxito!' });
            setTimeout(() => {
                navigate('/mascotas'); // Redirigimos a la lista de mascotas
            }, 1500);

        } catch (error) {
            setFeedback({ type: 'error', message: error.message || 'No se pudo publicar la mascota.' });
            setIsSubmitting(false);
        }
    };
    
    // ... (Renderizado del formulario)
    return (
        <div className="form-page">
            <h1>Publicar Mascota para Adopción</h1>
            <p className="form-page__subtitle">
                Completa los datos de la mascota.
            </p>

            <form className="form" onSubmit={handleSubmit}>
                {/* Selector de Especie */}
                <div className="form__row">
                    <label htmlFor="idEspecie">Especie</label>
                    <select
                        id="idEspecie"
                        name="idEspecie"
                        value={formValues.idEspecie}
                        onChange={handleChange}
                        required
                    >
                        <option value="" disabled>Selecciona una especie</option>
                        {especies.map(especie => (
                            <option key={especie.id} value={especie.id}>
                                {especie.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Edad */}
                <div className="form__row">
                    <label htmlFor="edad">Edad (en años)</label>
                    <input
                        id="edad"
                        name="edad"
                        type="number"
                        min="0"
                        value={formValues.edad}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Vacunas */}
                <div className="form__row">
                    <label htmlFor="vacunas">Vacunas (descripción)</label>
                    <input
                        id="vacunas"
                        name="vacunas"
                        type="text"
                        placeholder="Ej: Completas, al día, ninguna"
                        value={formValues.vacunas}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Imagen URL */}
                <div className="form__row">
                    <label htmlFor="imageUrl">URL de la Foto</label>
                    <input
                        id="imageUrl"
                        name="imageUrl"
                        type="url"
                        placeholder="https://ejemplo.com/foto.png"
                        value={formValues.imageUrl}
                        onChange={handleChange}
                    />
                </div>

                {/* Checkboxes */}
                <div className="form__row form__row--checkbox">
                    <input id="castrado" name="castrado" type="checkbox" checked={formValues.castrado} onChange={handleChange} />
                    <label htmlFor="castrado">¿Está castrado?</label>
                </div>
                <div className="form__row form__row--checkbox">
                    <input id="compatibleNiños" name="compatibleNiños" type="checkbox" checked={formValues.compatibleNiños} onChange={handleChange} />
                    <label htmlFor="compatibleNiños">¿Es compatible con niños?</label>
                </div>
                <div className="form__row form__row--checkbox">
                    <input id="compatibleMascotas" name="compatibleMascotas" type="checkbox" checked={formValues.compatibleMascotas} onChange={handleChange} />
                    <label htmlFor="compatibleMascotas">¿Es compatible con otras mascotas?</label>
                </div>

                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Publicando...' : 'Publicar Mascota'}
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

export default PublishPage;