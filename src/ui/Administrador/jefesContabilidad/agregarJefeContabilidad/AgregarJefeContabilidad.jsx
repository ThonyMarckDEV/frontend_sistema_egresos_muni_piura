import React, { useState } from 'react';
// 1. Importar el NUEVO servicio
import { createJefeContabilidad } from 'services/jefeContabilidadService';
import AlertMessage from 'components/Shared/Errors/AlertMessage';

// Importar los componentes de sección reutilizables (estos no cambian)
import DatosPersonalesFields from '../components/formularios/DatosPersonalesFields';
import DatosContactoFields from '../components/formularios/DatosContactoFields';
import DatosAccesoFields from '../components/formularios/DatosAccesoFields';

// 2. Cambiar el nombre del componente
export const AgregarJefeContabilidad = () => {
  
  // El estado inicial es idéntico
  const initialState = {
    datos: {
      nombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      sexo: 'M',
      dni: '',
    },
    contacto: {
      telefonoMovil: '',
      correo: '',
    },
    usuario: {
      username: '',
      password: '',
    },
  };

  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  
  const [alertInfo, setAlertInfo] = useState({
    type: null,
    message: null,
    details: []
  });

  // El manejador de cambios no cambia
  const handleChange = (e) => {
    const { name, value, dataset } = e.target;
    const { section } = dataset;

    setFormData((prevData) => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlertInfo({ type: null, message: null, details: [] });

    try {
      // 3. Usar la NUEVA función del servicio
      const response = await createJefeContabilidad(formData);
      
      setAlertInfo({
        type: 'success',
        // 4. Cambiar el mensaje de éxito
        message: response.message || 'Jefe de Contabilidad creado exitosamente.',
        details: []
      });
      setFormData(initialState);

    } catch (err) {
      console.error("Error recibido:", err);

      // 5. Cambiar el mensaje de error
      let errorMessage = 'Ocurrió un error al crear el Jefe de Contabilidad.';
      let errorDetails = [];

      if (err.details && typeof err.details === 'object') {
        errorMessage = err.message || 'Error de validación.';
        errorDetails = Object.values(err.details).flat();
      } else if (err.message) {
        errorMessage = err.message;
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
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-4">
        {/* 6. Cambiar el título */}
        Registrar Nuevo Jefe de Contabilidad
      </h2>

      <form onSubmit={handleSubmit}>
        
        <AlertMessage
          type={alertInfo.type}
          message={alertInfo.message}
          details={alertInfo.details}
          onClose={handleCloseAlert}
        />

        {/* Los componentes reutilizables se quedan igual */}
        <DatosPersonalesFields 
          formData={formData.datos} 
          handleChange={handleChange}
          disabled={loading} 
        />
        
        <DatosContactoFields 
          formData={formData.contacto} 
          handleChange={handleChange} 
          disabled={loading} 
        />
        
        <DatosAccesoFields 
          formData={formData.usuario} 
          handleChange={handleChange} 
          isEditing={false}
          disabled={loading} 
        />

        {/* --- Botón de Envío --- */}
        <div className="mt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:bg-gray-400"
          >
            {/* 7. Cambiar el texto del botón */}
            {loading ? 'Guardando...' : 'Guardar Jefe de Contabilidad'}
          </button>
        </div>
      </form>
    </div>
  );
};

// 8. Cambiar el export default
export default AgregarJefeContabilidad;