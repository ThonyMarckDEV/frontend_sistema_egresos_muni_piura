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

const sexoOptions = [
  { value: 'M', label: 'Masculino' },
  { value: 'F', label: 'Femenino' },
];

const DatosPersonalesFields = ({ formData, handleChange, disabled = false }) => {
  return (
    <section className="mb-6">
      <h3 className="text-lg font-medium text-gray-700 mb-4">Datos Personales</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        <InputField 
          label="Nombre" 
          id="nombre" 
          name="nombre" 
          value={formData.nombre} 
          onChange={handleChange} 
          section="datos" 
          disabled={disabled}
        />
        <InputField 
          label="Apellido Paterno" 
          id="apellidoPaterno" 
          name="apellidoPaterno" 
          value={formData.apellidoPaterno} 
          onChange={handleChange} 
          section="datos" 
          disabled={disabled}
        />
        <InputField 
          label="Apellido Materno" 
          id="apellidoMaterno" 
          name="apellidoMaterno" 
          value={formData.apellidoMaterno} 
          onChange={handleChange} 
          section="datos" 
          disabled={disabled}
        />
        <SelectField 
          label="Sexo"
          id="sexo"
          name="sexo"
          value={formData.sexo}
          onChange={handleChange}
          section="datos"
          options={sexoOptions}
          disabled={disabled}
        />
        <InputField 
          label="DNI" 
          id="dni" 
          name="dni" 
          value={formData.dni} 
          onChange={handleChange} 
          section="datos" 
          disabled={disabled}
        />
      </div>
    </section>
  );
};

export default DatosPersonalesFields;