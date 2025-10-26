import React from 'react';

const DatosContactoFields = ({ formData, handleChange, disabled }) => {
  return (
    <div className="mb-6 p-4 border border-gray-200 rounded-md">
      <h3 className="text-lg font-medium mb-4 text-gray-700">Datos de Contacto</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="telefonoMovil" className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono Móvil *
          </label>
          <input
            id="telefonoMovil"
            type="tel"
            name="telefonoMovil"
            data-section="contacto"
            value={formData.telefonoMovil || ''}
            onChange={handleChange}
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            required
          />
        </div>
        <div>
          <label htmlFor="correo" className="block text-sm font-medium text-gray-700 mb-1">
            Correo Electrónico *
          </label>
          <input
            id="correo"
            type="email"
            name="correo"
            data-section="contacto"
            value={formData.correo || ''}
            onChange={handleChange}
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default DatosContactoFields;