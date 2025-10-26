import React from 'react';

const DatosPersonalesFields = ({ formData, handleChange, disabled }) => {
  return (
    <div className="mb-6 p-4 border border-gray-200 rounded-md">
      <h3 className="text-lg font-medium mb-4 text-gray-700">Datos Personales</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre *
          </label>
          <input
            id="nombre"
            type="text"
            name="nombre"
            data-section="datos"
            value={formData.nombre || ''}
            onChange={handleChange}
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            required
          />
        </div>
        <div>
          <label htmlFor="apellidoPaterno" className="block text-sm font-medium text-gray-700 mb-1">
            Apellido Paterno *
          </label>
          <input
            id="apellidoPaterno"
            type="text"
            name="apellidoPaterno"
            data-section="datos"
            value={formData.apellidoPaterno || ''}
            onChange={handleChange}
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            required
          />
        </div>
        <div>
          <label htmlFor="apellidoMaterno" className="block text-sm font-medium text-gray-700 mb-1">
            Apellido Materno
          </label>
          <input
            id="apellidoMaterno"
            type="text"
            name="apellidoMaterno"
            data-section="datos"
            value={formData.apellidoMaterno || ''}
            onChange={handleChange}
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          />
        </div>
        <div>
          <label htmlFor="dni" className="block text-sm font-medium text-gray-700 mb-1">
            DNI *
          </label>
          <input
            id="dni"
            type="text"
            name="dni"
            data-section="datos"
            value={formData.dni || ''}
            onChange={handleChange}
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Sexo *</label>
          <select
            name="sexo"
            data-section="datos"
            value={formData.sexo || 'M'}
            onChange={handleChange}
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            required
          >
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default DatosPersonalesFields;