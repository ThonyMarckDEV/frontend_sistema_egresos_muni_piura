import React, { useState } from 'react';

// --- Iconos (puedes moverlos a su propio archivo si quieres) ---
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
// --- Fin Iconos ---


const InputField = ({ label, id, name, value, onChange, section, type = 'text', required = true, disabled = false, autoComplete = "off" }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const effectiveType = type === 'password' && isPasswordVisible ? 'text' : type;
  const toggleVisibility = () => setIsPasswordVisible(!isPasswordVisible);

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <input
          type={effectiveType}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          data-section={section}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm pr-10 disabled:bg-gray-50"
        />
        {/* Lógica para mostrar el ojo SOLO si es tipo password */}
        {type === 'password' && (
          <button
            type="button"
            onClick={toggleVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
            aria-label="Toggle password visibility"
            disabled={disabled}
          >
            {isPasswordVisible ? <EyeSlashIcon /> : <EyeIcon />}
          </button>
        )}
      </div>
    </div>
  );
};

const SelectField = ({ label, id, name, value, onChange, section, options = [], required = true, disabled = false }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      data-section={section}
      required={required}
      disabled={disabled}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-50"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const estadoOptions = [
  { value: 1, label: 'Activo' },
  { value: 0, label: 'Inactivo' },
];

const DatosAccesoFields = ({ formData, handleChange, isEditing = false, disabled = false }) => {
  return (
    <section className="mb-6 p-4 border border-gray-200 rounded-md"> {/* Añadido padding y borde como los otros */}
      <h3 className="text-lg font-medium text-gray-700 mb-4">Datos de Acceso</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        <InputField 
          label="Nombre de Usuario *" 
          id="username" 
          name="username" 
          value={formData.username} 
          onChange={handleChange} 
          section="usuario" 
          disabled={disabled}
          type="text"
          required={true} // Username siempre requerido
        />

        {isEditing ? (
          <SelectField 
            label="Estado *"
            id="estado"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            section="usuario"
            options={estadoOptions}
            disabled={disabled}
            required={true} // Estado siempre requerido
          />
        ) : (
          <div></div> // Espacio vacío si no está editando (modo Creación)
        )}
        
        <InputField 
          label={isEditing ? "Nueva Contraseña (opcional)" : "Contraseña *"} 
          id="password" 
          name="password" 
          value={formData.password} 
          onChange={handleChange} 
          section="usuario" 
          type="password"
          required={!isEditing} // Contraseña requerida solo al crear
          disabled={disabled}
          autoComplete={isEditing ? "new-password" : "off"}
        />
      </div>
    </section>
  );
};

export default DatosAccesoFields;