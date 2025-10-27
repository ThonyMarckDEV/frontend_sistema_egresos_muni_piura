import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// 1. Importar servicios de categoria
import { getCategoriaById, updateCategoria } from 'services/categoriaService';
import AlertMessage from 'components/Shared/Errors/AlertMessage';

// 2. Estado inicial simple
const initialState = {
  nombre: '',
  estado: 1,
};

export const EditarCategoria = () => {
  const { id } = useParams(); 
  
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [alertInfo, setAlertInfo] = useState({
    type: null,
    message: null,
    details: []
  });

  useEffect(() => {
    const fetchCategoria = async () => {
      setAlertInfo({ type: null, message: null, details: [] });
      setLoading(true);
      try {
        // 3. Usar servicio de categoria
        const responseObject = await getCategoriaById(id);
        const categoriaData = responseObject.data; // Viene de handleResponse

        if (!categoriaData) {
          throw new Error("La estructura de datos recibida no es la esperada.");
        }
        
        // 4. Poblar el estado simple
        setFormData({
          nombre: categoriaData.nombre || '',
          estado: categoriaData.estado !== undefined ? categoriaData.estado : 1,
        });

      } catch (err) {
        console.error("Error al cargar categoría:", err);
        setAlertInfo({
          type: 'error',
          message: 'Error al cargar la categoría.',
          details: [err.message || 'No se pudieron obtener los datos.']
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCategoria();
  }, [id]);

  // 5. handleChange SIMPLIFICADO
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    const finalValue = name === 'estado' ? parseInt(value, 10) : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: finalValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setAlertInfo({ type: null, message: null, details: [] });

    // 6. dataToSend es simple
    const dataToSend = { ...formData }; 

    try {
      // 7. Usar servicio de categoria
      const response = await updateCategoria(id, dataToSend); 
      setAlertInfo({
        type: 'success',
        message: response.message || 'Categoría actualizada exitosamente.',
        details: []
      });

      // Aquí podrías redirigir si quisieras, ej:
      // setTimeout(() => navigate('/contador/categorias'), 2000);

    } catch (err) {
      console.error("Error al actualizar:", err);
      setAlertInfo({
        type: 'error',
        message: err.message,
        details: err.details || []
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center p-8 text-gray-500">Cargando datos de la categoría...</div>;
  }

  return (
    // 8. Formulario más pequeño
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-4">
        Editar Categoría (ID: {id})
      </h2>

      <form onSubmit={handleSubmit}>
        <AlertMessage
          type={alertInfo.type}
          message={alertInfo.message}
          details={alertInfo.details}
          onClose={() => setAlertInfo({ type: null, message: null, details: [] })}
        />

        {/* 9. Inputs de Categoría (en lugar de componentes) */}
        <div className="mb-4">
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de la Categoría *
          </label>
          <input
            id="nombre"
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            disabled={saving || loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">
            Estado *
          </label>
          <select
            id="estado"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            disabled={saving || loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          >
            <option value={1}>Activo</option>
            <option value={0}>Inactivo</option>
          </select>
        </div>
        {/* --- Fin de Inputs --- */}


        <div className="mt-6">
          <button
            type="submit"
            disabled={saving || loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:bg-gray-400"
          >
            {saving ? 'Guardando cambios...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditarCategoria;