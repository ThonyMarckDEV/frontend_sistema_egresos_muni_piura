import React, { useState, useEffect } from 'react';
import { getContadorById } from 'services/contadorService';

// Pequeño componente interno para mostrar los campos de info
const InfoField = ({ label, value }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-500 mb-1">
      {label}
    </label>
    <input
      type="text"
      value={value || ''}
      disabled
      className="w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm bg-gray-100 text-gray-700 cursor-not-allowed"
    />
  </div>
);

// Componente del Modal
const ModalInfoContador = ({ isOpen, onClose, contadorId }) => {
  const [contadorData, setContadorData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Solo busca datos si el modal está abierto y hay un ID
    if (isOpen && contadorId) {
      const fetchData = async () => {
        setLoading(true);
        setError(null);
        setContadorData(null);
        try {
          // 1. Llamamos al servicio (que ya usa handleResponse)
          const response = await getContadorById(contadorId);
          
          // 2. Extraemos la data formateada {datos, contacto, usuario}
          const formattedData = response.data;

          if (!formattedData || !formattedData.datos || !formattedData.contacto) {
            throw new Error("La estructura de datos recibida no es la esperada.");
          }
          
          setContadorData(formattedData);

        } catch (err) {
          console.error("Error al cargar datos del contador:", err);
          setError(err.message || 'No se pudieron cargar los datos.');
        } finally {
          setLoading(false);
        }
      };
      
      fetchData();
    }
  }, [isOpen, contadorId]); // Se ejecuta cada vez que cambia el ID o el estado 'isOpen'

  // Si no está abierto, no renderiza nada
  if (!isOpen) {
    return null;
  }

  return (
    // Overlay (fondo oscuro)
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose} // Cierra el modal si se hace clic en el fondo
    >
      {/* Contenedor del Modal */}
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 m-4"
        onClick={(e) => e.stopPropagation()} // Evita que el clic en el modal lo cierre
      >
        {/* Encabezado del Modal */}
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Información del Contador
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
            aria-label="Cerrar"
          >
            &times;
          </button>
        </div>

        {/* Cuerpo del Modal */}
        <div>
          {loading && <div className="text-center p-4 text-gray-500">Cargando...</div>}
          
          {error && <div className="p-3 bg-red-50 text-red-800 rounded-md border border-red-200">{error}</div>}
          
          {contadorData && (
            <div className="max-h-[70vh] overflow-y-auto pr-2">
              {/* Sección Datos Personales */}
              <h4 className="text-lg font-medium mb-3 text-gray-700">Datos Personales</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                <InfoField label="Nombre" value={contadorData.datos.nombre} />
                <InfoField label="Apellido Paterno" value={contadorData.datos.apellidoPaterno} />
                <InfoField label="Apellido Materno" value={contadorData.datos.apellidoMaterno} />
                <InfoField label="DNI" value={contadorData.datos.dni} />
                <InfoField 
                  label="Sexo" 
                  value={contadorData.datos.sexo === 'M' ? 'Masculino' : 'Femenino'} 
                />
              </div>

              {/* Sección Datos de Contacto */}
              <h4 className="text-lg font-medium mt-4 mb-3 text-gray-700">Datos de Contacto</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                <InfoField label="Teléfono Móvil" value={contadorData.contacto.telefonoMovil} />
                <InfoField label="Correo Electrónico" value={contadorData.contacto.correo} />
              </div>
            </div>
          )}
        </div>

        {/* Pie del Modal */}
        <div className="border-t pt-4 mt-4 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalInfoContador;