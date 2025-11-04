import React, { useState, useEffect } from 'react';
import { getVeterinarios, createVeterinario, updateVeterinario, deleteVeterinario } from '../../services/apiService.js';

const AdminVeterinarios = () => {
  const [veterinarios, setVeterinarios] = useState([]);
  const [formData, setFormData] = useState({ nombre: '', apellido: '', matricula: '' });
  const [editId, setEditId] = useState(null); // Para saber si estamos editando
  const [error, setError] = useState(null);

  // Cargar todos los veterinarios al iniciar
  useEffect(() => {
    fetchVeterinarios();
  }, []);

  const fetchVeterinarios = async () => {
    try {
      const response = await getVeterinarios();
      setVeterinarios(response.data);
    } catch (err) {
      setError('Error al cargar veterinarios: ' + err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombre || !formData.apellido || !formData.matricula) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    try {
      if (editId) {
        // Actualizar
        await updateVeterinario(editId, formData);
      } else {
        // Crear
        await createVeterinario(formData);
      }
      resetForm();
      fetchVeterinarios(); // Recargar la lista
    } catch (err) {
      setError('Error al guardar: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleEdit = (vet) => {
    setEditId(vet.id);
    setFormData({ nombre: vet.nombre, apellido: vet.apellido, matricula: vet.matricula });
    setError(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este veterinario?')) {
      try {
        await deleteVeterinario(id);
        fetchVeterinarios(); // Recargar la lista
      } catch (err) {
        setError('Error al eliminar: ' + err.message);
      }
    }
  };

  const resetForm = () => {
    setEditId(null);
    setFormData({ nombre: '', apellido: '', matricula: '' });
    setError(null);
  };

  return (
    <div>
      <h1>Administrar Veterinarios</h1>

      {/* Formulario de Creación / Edición */}
      <form onSubmit={handleSubmit} className="crud-form">
        <h2>{editId ? 'Editar Veterinario' : 'Nuevo Veterinario'}</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div>
          <label htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="apellido">Apellido:</label>
          <input
            type="text"
            id="apellido"
            name="apellido"
            value={formData.apellido}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="matricula">Matrícula:</label>
          <input
            type="text"
            id="matricula"
            name="matricula"
            value={formData.matricula}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {editId ? 'Actualizar' : 'Guardar'}
        </button>
        {editId && (
          <button type="button" onClick={resetForm} className="btn" style={{ marginLeft: '10px' }}>
            Cancelar Edición
          </button>
        )}
      </form>

      {/* Lista de Veterinarios */}
      <div className="crud-list">
        <h2>Lista de Veterinarios</h2>
        <ul>
          {veterinarios.map((vet) => (
            <li key={vet.id}>
              <span>{vet.nombre} {vet.apellido} (Matrícula: {vet.matricula})</span>
              <div>
                <button onClick={() => handleEdit(vet)} className="btn">Editar</button>
                <button onClick={() => handleDelete(vet.id)} className="btn btn-danger">Eliminar</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminVeterinarios;