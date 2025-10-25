import React, { useState } from 'react';
import { createContador } from 'services/contadorService';
import AlertMessage from 'components/Shared/Errors/AlertMessage';

const InputField = ({ label, id, name, value, onChange, section, type = 'text', required = true }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      data-section={section}
      required={required}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    />
  </div>
);

export const AgregarContador = () => {
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

  /**
   * Maneja el envío del formulario.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlertInfo({ type: null, message: null, details: [] });

    try {
      const response = await createContador(formData);
      
      setAlertInfo({
        type: 'success',
        message: response.message || 'Contador creado exitosamente.',
        details: []
      });
      setFormData(initialState);

    } catch (err) {
      console.error("Error recibido:", err);

      let errorMessage = 'Ocurrió un error al crear el contador.';
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
        Registrar Nuevo Contador
      </h2>

      <form onSubmit={handleSubmit}>
        
        {/* El componente AlertMessage ahora recibirá 'details' como array */}
        <AlertMessage
          type={alertInfo.type}
          message={alertInfo.message}
          details={alertInfo.details}
          onClose={handleCloseAlert}
        />

        {/* --- Sección de Datos Personales --- */}
        <section className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Datos Personales</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <InputField label="Nombre" id="nombre" name="nombre" value={formData.datos.nombre} onChange={handleChange} section="datos" />
            <InputField label="Apellido Paterno" id="apellidoPaterno" name="apellidoPaterno" value={formData.datos.apellidoPaterno} onChange={handleChange} section="datos" />
            <InputField label="Apellido Materno" id="apellidoMaterno" name="apellidoMaterno" value={formData.datos.apellidoMaterno} onChange={handleChange} section="datos" />
            
            <div className="mb-4">
              <label htmlFor="sexo" className="block text-sm font-medium text-gray-700 mb-1">
                Sexo
              </label>
              <select
                id="sexo"
                name="sexo"
                value={formData.datos.sexo}
                onChange={handleChange}
                data-section="datos"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
              </select>
            </div>

            <InputField label="DNI" id="dni" name="dni" value={formData.datos.dni} onChange={handleChange} section="datos" />
          </div>
        </section>

        {/* --- Sección de Datos de Contacto --- */}
        <section className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Datos de Contacto</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <InputField label="Teléfono Móvil" id="telefonoMovil" name="telefonoMovil" value={formData.contacto.telefonoMovil} onChange={handleChange} section="contacto" />
            <InputField label="Correo Electrónico" id="correo" name="correo" value={formData.contacto.correo} onChange={handleChange} section="contacto" type="email" required={false} />
          </div>
        </section>

        {/* --- Sección de Datos de Acceso --- */}
        <section className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Datos de Acceso</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <InputField label="Nombre de Usuario" id="username" name="username" value={formData.usuario.username} onChange={handleChange} section="usuario" />
            <InputField label="Contraseña" id="password" name="password" value={formData.usuario.password} onChange={handleChange} section="usuario" type="password" />
          </div>
        </section>

        {/* --- Botón de Envío --- */}
        <div className="mt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:bg-gray-400"
          >
            {loading ? 'Guardando...' : 'Guardar Contador'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AgregarContador;