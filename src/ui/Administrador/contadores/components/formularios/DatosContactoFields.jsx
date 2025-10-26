import React from 'react';

const InputField = ({ label, id, name, value, onChange, section, type = 'text', required = true, disabled = false, autoComplete = "off" }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      data-section={section}
      required={required}
      disabled={disabled}
      autoComplete={autoComplete}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-50"
    />
  </div>
);

const DatosContactoFields = ({ formData, handleChange, disabled = false }) => {
  return (
    <section className="mb-6">
      <h3 className="text-lg font-medium text-gray-700 mb-4">Datos de Contacto</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        <InputField 
          label="Teléfono Móvil" 
          id="telefonoMovil" 
          name="telefonoMovil" 
          value={formData.telefonoMovil} 
          onChange={handleChange} 
          section="contacto" 
          disabled={disabled}
        />
        <InputField 
          label="Correo Electrónico" 
          id="correo" 
          name="correo" 
          value={formData.correo} 
          onChange={handleChange} 
          section="contacto" 
          type="email" 
          required={false} 
          disabled={disabled}
        />
      </div>
    </section>
  );
};

export default DatosContactoFields;