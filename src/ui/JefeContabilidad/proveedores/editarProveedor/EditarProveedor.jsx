import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// 1. Importar servicios de proveedor
import { getProveedorById, updateProveedor } from 'services/proveedorService';
import AlertMessage from 'components/Shared/Errors/AlertMessage';

// 2. Estado inicial adaptado para Proveedor
const initialState = {
  nombre: '',
  ruc: '',
  dni: '',
  descripcion: '',
  estado: 1,
};

export const EditarProveedor = () => {
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
    const fetchProveedor = async () => {
      setAlertInfo({ type: null, message: null, details: [] });
      setLoading(true);
      try {
        // 3. Usar servicio de proveedor
        const responseObject = await getProveedorById(id);
        
        // Asumo que tu handleResponse devuelve el objeto proveedor directamente
        // o dentro de .data. Ajusta si es necesario.
        const proveedorData = responseObject.data || responseObject; 

        if (!proveedorData) {
          throw new Error("La estructura de datos recibida no es la esperada.");
        }
        
        // 4. Poblar el estado con todos los campos de proveedor
        setFormData({
          nombre: proveedorData.nombre || '',
          ruc: proveedorData.ruc || '',
          dni: proveedorData.dni || '',
          descripcion: proveedorData.descripcion || '',
          estado: proveedorData.estado !== undefined ? proveedorData.estado : 1,
        });

      } catch (err) {
        console.error("Error al cargar proveedor:", err);
        setAlertInfo({
          type: 'error',
          message: 'Error al cargar el proveedor.', // Mensaje adaptado
          details: [err.message || 'No se pudieron obtener los datos.']
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProveedor();
  }, [id]);

  // 5. handleChange es genérico y funciona sin cambios
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

    // 6. dataToSend es el formData completo
    const dataToSend = { ...formData }; 

    try {
      // 7. Usar servicio de proveedor
      const response = await updateProveedor(id, dataToSend); 
      setAlertInfo({
        type: 'success',
        message: response.message || 'Proveedor actualizado exitosamente.', // Mensaje adaptado
        details: []
      });

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
    return <div className="text-center p-8 text-gray-500">Cargando datos del proveedor...</div>;
  }

  return (
    // 8. Formulario más grande (max-w-2xl)
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-4">
        Editar Proveedor (ID: {id})
      </h2>

      <form onSubmit={handleSubmit}>
        <AlertMessage
          type={alertInfo.type}
          message={alertInfo.message}
          details={alertInfo.details}
          onClose={() => setAlertInfo({ type: null, message: null, details: [] })}
        />

        {/* 9. Inputs de Proveedor (adaptados de 'AgregarProveedor') */}
        <div className="mb-4">
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre o Razón Social *
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="ruc" className="block text-sm font-medium text-gray-700 mb-1">
              RUC (Opcional - Empresa)
            </label>
            <input
              id="ruc"
              type="text"
              name="ruc"
              value={formData.ruc}
              onChange={handleChange}
              disabled={saving || loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              maxLength={11}
            />
          </div>
          <div>
            <label htmlFor="dni" className="block text-sm font-medium text-gray-700 mb-1">
              DNI (Opcional - Persona)
            </label>
            <input
              id="dni"
              type="text"
              name="dni"
              value={formData.dni}
              onChange={handleChange}
              disabled={saving || loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              maxLength={8}
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
            Descripción (Opcional)
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            disabled={saving || loading}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
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

export default EditarProveedor;