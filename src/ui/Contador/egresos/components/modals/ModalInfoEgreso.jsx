import React, { useState, useEffect } from 'react';
// 1. Importar el servicio de egreso
import { getEgresoById } from 'services/egresoService';

// Componente interno para mostrar los campos
const InfoField = ({ label, value }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-500 mb-1">
      {label}
    </label>
    <input
      type="text"
      value={value || ''} // Muestra string vacío si es null o undefined
      disabled
      className="w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm bg-gray-100 text-gray-700 cursor-not-allowed"
    />
  </div>
);

// 2. Nombre del componente y prop
const ModalInfoEgreso = ({ isOpen, onClose, egresoId }) => {
  // 3. Estado adaptado
  const [egresoData, setEgresoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 4. Usar egresoId
    if (isOpen && egresoId) {
      const fetchData = async () => {
        setLoading(true);
        setError(null);
        setEgresoData(null); // Limpia datos anteriores
        try {
          // 6. Llamar al servicio correcto
          const response = await getEgresoById(egresoId);
          
          // El controller 'show' de Egreso trae 'categoria' y 'proveedor'
          const data = response.data || response;

          if (!data) {
            throw new Error("La estructura de datos recibida no es la esperada.");
          }
          
          setEgresoData(data); // 7. Guardar datos

        } catch (err) {
          // 8. Mensaje de error adaptado
          console.error("Error al cargar datos del egreso:", err);
          setError(err.message || 'No se pudieron cargar los datos.');
        } finally {
          setLoading(false);
        }
      };
      
      fetchData();
    }
  }, [isOpen, egresoId]); // 9. Dependencia actualizada

  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 m-4"
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            {/* 10. Título adaptado */}
            Información del Egreso
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
            aria-label="Cerrar"
          >
            &times;
          </button>
        </div>

        <div>
          {loading && <div className="text-center p-4 text-gray-500">Cargando...</div>}
          {error && <div className="p-3 bg-red-50 text-red-800 rounded-md border border-red-200">{error}</div>}
          
          {/* 11. Usar egresoData */}
          {egresoData && (
            <div className="max-h-[70vh] overflow-y-auto pr-2">
              <h4 className="text-lg font-medium mb-3 text-gray-700">Detalles del Egreso</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                {/* Campos adaptados para Egreso */}
                <InfoField label="Monto" value={`S/ ${parseFloat(egresoData.monto).toFixed(2)}`} />
                <InfoField label="Categoría" value={egresoData.categoria ? egresoData.categoria.nombre : 'N/A'} />
                <InfoField label="Proveedor" value={egresoData.proveedor ? egresoData.proveedor.nombre : 'N/A'} />
                <InfoField 
                  label="Fecha de Registro" 
                  value={new Date(egresoData.created_at).toLocaleString('es-ES')} 
                />
              </div>
              {/* Campo de descripción (ocupa 2 columnas) */}
              <div className="mt-4">
                <InfoField label="Descripción" value={egresoData.descripcion} />
              </div>
            </div>
          )}
        </div>

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

export default ModalInfoEgreso;