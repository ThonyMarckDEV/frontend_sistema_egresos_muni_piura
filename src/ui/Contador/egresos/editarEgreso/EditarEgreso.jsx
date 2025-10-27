import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// 1. Importar servicios de egreso
import { getEgresoById, updateEgreso } from 'services/egresoService';
import AlertMessage from 'components/Shared/Errors/AlertMessage';

// --- NUEVAS IMPORTACIONES ---
// Importa los selects con filtro (ajusta las rutas)
import CategoriaSelect from 'components/Shared/Comboboxes/CategorySelect';
import ProveedorSelect from 'components/Shared/Comboboxes/ProveedorSelect';

// 2. Estado inicial adaptado para Egreso
const initialState = {
  monto: '',
  categoria_id: '',
  proveedor_id: '',
  descripcion: '',
};

export const EditarEgreso = () => {
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
    // Nombre de función adaptado
    const fetchEgreso = async () => {
      setAlertInfo({ type: null, message: null, details: [] });
      setLoading(true);
      try {
        // 3. Usar servicio de egreso
        const responseObject = await getEgresoById(id);
        const egresoData = responseObject.data || responseObject; 

        if (!egresoData) {
          throw new Error("La estructura de datos recibida no es la esperada.");
        }
        
        // 4. Poblar el estado con los campos de egreso
        setFormData({
          monto: egresoData.monto || '',
          // Aseguramos que los IDs sean strings para los selects
          categoria_id: egresoData.categoria_id ? String(egresoData.categoria_id) : '',
          proveedor_id: egresoData.proveedor_id ? String(egresoData.proveedor_id) : '',
          descripcion: egresoData.descripcion || '',
        });

      } catch (err) {
        console.error("Error al cargar egreso:", err);
        setAlertInfo({
          type: 'error',
          message: 'Error al cargar el egreso.',
          details: [err.message || 'No se pudieron obtener los datos.']
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEgreso();
  }, [id]);

  // 5. Handlers de cambio (separados)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCategoriaChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      categoria_id: e.target.value,
    }));
  };
  
  const handleProveedorChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      proveedor_id: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setAlertInfo({ type: null, message: null, details: [] });

    // 6. dataToSend
    const dataToSend = {
      ...formData,
      proveedor_id: formData.proveedor_id || null, // Enviar null si está vacío
    }; 

    try {
      // 7. Usar servicio de egreso
      const response = await updateEgreso(id, dataToSend); 
      setAlertInfo({
        type: 'success',
        message: response.message || 'Egreso actualizado exitosamente.',
        details: []
      });

    } catch (err) {
      console.error("Error al actualizar:", err);
      let errorDetails = err.details || [];
      if (typeof errorDetails === 'object' && !Array.isArray(errorDetails)) {
        errorDetails = Object.values(errorDetails).flat();
      }
      setAlertInfo({
        type: 'error',
        message: err.message,
        details: errorDetails
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center p-8 text-gray-500">Cargando datos del egreso...</div>;
  }

  return (
    // 8. Formulario
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-4">
        Editar Egreso (ID: {id})
      </h2>

      <form onSubmit={handleSubmit}>
        <AlertMessage
          type={alertInfo.type}
          message={alertInfo.message}
          details={alertInfo.details}
          onClose={() => setAlertInfo({ type: null, message: null, details: [] })}
        />

        {/* 9. Inputs de Egreso */}
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
            disabled={saving || loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            step="0.01"
            required
          />
        </div>

        <div className="mb-4">
          <CategoriaSelect
            value={formData.categoria_id}
            onChange={handleCategoriaChange}
            errors={{}}
            disabled={saving || loading}
          />
        </div>

        <div className="mb-4">
          <ProveedorSelect
            value={formData.proveedor_id}
            onChange={handleProveedorChange}
            errors={{}}
            disabled={saving || loading}
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
            disabled={saving || loading}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          />
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

export default EditarEgreso;