import React, { useState, useEffect } from 'react';
import { getCuentaPorPagarById } from 'services/cuentaPorPagarService';

// Componente InfoField (sin cambios)
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

// Componente EstadoCuentaBadge (sin cambios)
const EstadoCuentaBadge = ({ estado }) => {
  let classes = 'bg-gray-100 text-gray-800'; 
  let text = estado ? estado.charAt(0).toUpperCase() + estado.slice(1) : 'Desconocido';

  switch (estado) {
    case 'pendiente': classes = 'bg-yellow-100 text-yellow-800'; break;
    case 'pagado': classes = 'bg-green-100 text-green-800'; break;
    case 'vencido': classes = 'bg-red-100 text-red-800'; text = 'Vencido'; break;
    default: break;
  }
  return <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${classes}`}>{text}</span>;
};

const ModalInfoCuentaPorPagar = ({ isOpen, onClose, cuentaId }) => {
  const [cuentaData, setCuentaData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && cuentaId) {
      const fetchData = async () => {
        setLoading(true);
        setError(null);
        setCuentaData(null); 
        try {
          const response = await getCuentaPorPagarById(cuentaId);
          const data = response.data || response;

          if (!data || !data.egreso) {
            throw new Error("La estructura de datos recibida no es la esperada.");
          }
          
          setCuentaData(data); 

        } catch (err) {
          console.error("Error al cargar datos de la cuenta por pagar:", err);
          setError(err.message || 'No se pudieron cargar los datos.');
        } finally {
          setLoading(false);
        }
      };
      
      fetchData();
    }
  }, [isOpen, cuentaId]); 

  if (!isOpen) {
    return null;
  }

  const montoTotal = parseFloat(cuentaData?.egreso?.monto || 0);
  const montoPagado = parseFloat(cuentaData?.monto_pagado || 0);
  const saldoPendiente = montoTotal - montoPagado;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 m-4"
        onClick={(e) => e.stopPropagation()} 
      >
        {/* Encabezado (sin cambios) */}
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Información de la Cuenta por Pagar
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
          
          {cuentaData && (
            <div className="max-h-[70vh] overflow-y-auto pr-2">
              {/* Detalles de la Cuenta (sección principal) */}
              <h4 className="text-lg font-medium mb-3 text-gray-700">Detalles de la Cuenta</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                <InfoField label="Proveedor" value={cuentaData.egreso?.proveedor?.nombre || 'N/A'} />
                <InfoField label="Categoría Egreso" value={cuentaData.egreso?.categoria?.nombre || 'N/A'} />
                <InfoField label="Monto Total" value={`S/ ${montoTotal.toFixed(2)}`} />
                <InfoField label="Monto Pagado" value={`S/ ${montoPagado.toFixed(2)}`} />
                <InfoField label="Saldo Pendiente" value={`S/ ${saldoPendiente.toFixed(2)}`} />
                <InfoField 
                  label="Fecha de Vencimiento" 
                  value={new Date(cuentaData.fecha_vencimiento + 'T00:00:00').toLocaleDateString()} 
                />
                <div className="mb-4 md:col-span-2"> 
                  <label className="block text-sm font-medium text-gray-500 mb-1">Estado</label>
                  <EstadoCuentaBadge estado={cuentaData.estado} />
                </div>
              </div>
              <div className="mt-2">
                <InfoField label="Descripción Egreso Original" value={cuentaData.egreso?.descripcion} />
              </div>

              {/* --- NUEVA SECCIÓN: DETALLES DEL PAGO --- */}
              {/* Solo se muestra si el estado es 'pagado' */}
              {cuentaData.estado === 'pagado' && (
                <>
                  <h4 className="text-lg font-medium mt-6 mb-3 text-gray-700 border-t pt-4">Detalles del Pago</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                    <InfoField label="Método de Pago" value={cuentaData.metodo_pago || 'N/A'} />
                    {/* Solo muestra número de operación si no es 'Efectivo' y existe */}
                    {cuentaData.metodo_pago !== 'Efectivo' && (
                      <InfoField label="Número de Operación" value={cuentaData.numero_operacion || 'N/A'} />
                    )}
                     <InfoField 
                      label="Fecha de Pago" 
                      // Usa updated_at como fecha de pago (asumiendo que se actualiza al pagar)
                      value={new Date(cuentaData.updated_at).toLocaleString('es-ES')} 
                    />
                  </div>
                </>
              )}
              {/* --- FIN NUEVA SECCIÓN --- */}

            </div>
          )}
        </div>

        {/* Pie del Modal (sin cambios) */}
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

export default ModalInfoCuentaPorPagar;