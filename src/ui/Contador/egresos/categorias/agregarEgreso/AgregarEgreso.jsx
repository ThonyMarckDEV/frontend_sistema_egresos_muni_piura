import React, { useState } from 'react';
import { createEgreso } from 'services/egresoService';
import AlertMessage from 'components/Shared/Errors/AlertMessage';

// Importa los selects con filtro
import CategoriaSelect from 'components/Shared/Comboboxes/CategorySelect';
import ProveedorSelect from 'components/Shared/Comboboxes/ProveedorSelect';

const initialState = {
  monto: '',
  categoria_id: '',
  proveedor_id: '', // Proveedor es opcional, puede ir vacío
  descripcion: '',
};

export const AgregarEgreso = () => {
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  
  const [alertInfo, setAlertInfo] = useState({
    type: null,
    message: null,
    details: []
  });

  // Manejador para inputs simples (monto, descripcion)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Manejador SÓLO para CategoriaSelect
  // (porque ese componente devuelve "id_Categoria" como 'name')
  const handleCategoriaChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      categoria_id: e.target.value,
    }));
  };
  
  // Manejador SÓLO para ProveedorSelect
  // (porque ese componente devuelve "id_Proveedor" como 'name')
  const handleProveedorChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      proveedor_id: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlertInfo({ type: null, message: null, details: [] });

    // Prepara los datos (asegura que el proveedor_id sea null si está vacío)
    const dataToSend = {
      ...formData,
      proveedor_id: formData.proveedor_id || null,
    };

    try {
      const response = await createEgreso(dataToSend);
      
      setAlertInfo({
        type: 'success',
        message: response.message || 'Egreso creado exitosamente.',
        details: []
      });
      setFormData(initialState);

    } catch (err) {
      console.error("Error recibido:", err);
      let errorMessage = err.message || 'Ocurrió un error al crear el egreso.';
      let errorDetails = err.details || [];
      
      // Si 'err.details' es un objeto (de validación), lo convierte en array
      if (typeof errorDetails === 'object' && !Array.isArray(errorDetails)) {
        errorDetails = Object.values(errorDetails).flat();
      }
      
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
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-4">
        Registrar Nuevo Egreso
      </h2>

      <form onSubmit={handleSubmit}>
        
        <AlertMessage
          type={alertInfo.type}
          message={alertInfo.message}
          details={alertInfo.details}
          onClose={handleCloseAlert}
        />

        {/* --- Inputs de Egreso --- */}
        
        <div className="mb-4">
          <label htmlFor="monto" className="block text-sm font-medium text-gray-700 mb-1">
            Monto *
          </label>
          <input
            id="monto"
            type="number"
            name="monto"
            value={formData.monto}
            onChange={handleInputChange}
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            step="0.01"
            required
          />
        </div>

        <div className="mb-4">
          {/* Usamos el CategoriaSelect */}
          <CategoriaSelect
            value={formData.categoria_id}
            onChange={handleCategoriaChange}
            errors={{}} // Asumimos que los errores se manejan solo en el AlertMessage
            disabled={loading}
          />
        </div>

        <div className="mb-4">
          {/* Usamos el ProveedorSelect */}
          <ProveedorSelect
            value={formData.proveedor_id}
            onChange={handleProveedorChange}
            errors={{}} // Asumimos que los errores se manejan solo en el AlertMessage
            disabled={loading}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
            Descripción (Opcional)
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleInputChange}
            disabled={loading}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          />
        </div>
        
        {/* --- Fin de Inputs --- */}

        <div className="mt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:bg-gray-400"
          >
            {loading ? 'Guardando...' : 'Guardar Egreso'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AgregarEgreso;