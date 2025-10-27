import React, { useState } from 'react';
// 1. Importar el nuevo servicio
import { createCategoria } from 'services/categoriaService'; 
import AlertMessage from 'components/Shared/Errors/AlertMessage';

// 2. Estado inicial simple
const initialState = {
  nombre: '',
  estado: 1, // Por defecto 'Activo'
};

export const AgregarCategoria = () => {
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  
  const [alertInfo, setAlertInfo] = useState({
    type: null,
    message: null,
    details: []
  });

  // 3. Manejador de cambios SIMPLIFICADO (sin 'section')
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Convertir 'estado' a número, el resto se queda como string
    const finalValue = name === 'estado' ? parseInt(value, 10) : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: finalValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlertInfo({ type: null, message: null, details: [] });

    try {
      // 4. Llamar al servicio de 'createCategoria'
      const response = await createCategoria(formData);
      
      setAlertInfo({
        type: 'success',
        message: response.message || 'Categoría creada exitosamente.',
        details: []
      });
      // Limpiar el formulario
      setFormData(initialState);

    } catch (err) {
      console.error("Error recibido:", err);
      // El 'handleResponse' ya formatea el error
      let errorMessage = err.message || 'Ocurrió un error al crear la categoría.';
      let errorDetails = err.details || [];
      
      setAlertInfo({
        type: 'error',
        message: errorMessage,
        details: errorDetails 
      });

    } finally {
      setLoading(false);
    }
  };

  const handleCloseAlert = () => {
    setAlertInfo({ type: null, message: null, details: [] });
  };

  return (
    // Usamos max-w-xl porque es un formulario más pequeño
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-4">
        Registrar Nueva Categoría
      </h2>

      <form onSubmit={handleSubmit}>
        
        <AlertMessage
          type={alertInfo.type}
          message={alertInfo.message}
          details={alertInfo.details}
          onClose={handleCloseAlert}
        />

        {/* --- Inputs de Categoría --- */}
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
            disabled={loading}
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
            disabled={loading}
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
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:bg-gray-400"
          >
            {loading ? 'Guardando...' : 'Guardar Categoría'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AgregarCategoria;