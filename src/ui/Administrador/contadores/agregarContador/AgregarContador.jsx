import React, { useState } from 'react';
import { createContador } from 'services/contadorService';
import AlertMessage from 'components/Shared/Errors/AlertMessage';

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const EyeSlashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L12 12" />
  </svg>
);

const InputField = ({ label, id, name, value, onChange, section, type = 'text', required = true }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  
  const effectiveType = type === 'password' && isPasswordVisible ? 'text' : type;

  const toggleVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>

      <div className="relative">
        <input
          type={effectiveType}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          data-section={section}
          required={required}

          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm pr-10"
        />

        {type === 'password' && (
          <button
            type="button"
            onClick={toggleVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            aria-label="Toggle password visibility"
          >
            {isPasswordVisible ? <EyeSlashIcon /> : <EyeIcon />}
          </button>
        )}
      </div>
    </div>
  );
};



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
            <InputField 
              label="Contraseña" 
              id="password" 
              name="password" 
              value={formData.usuario.password} 
              onChange={handleChange} 
              section="usuario" 
              type="password"
            />
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
