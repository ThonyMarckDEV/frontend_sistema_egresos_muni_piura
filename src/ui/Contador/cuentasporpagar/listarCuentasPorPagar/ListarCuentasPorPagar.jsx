import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCuentasPorPagar } from 'services/cuentaPorPagarService'; 
import Pagination from 'components/Shared/Pagination';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ModalInfoCuentaPorPagar from '../components/modals/ModalInfoCuentasPorPagar'; 
// --- NUEVA IMPORTACIÓN ---
import PaymentModal from '../components/modals/PaymentModal';

// --- NUEVO COMPONENTE: EstadoCuentaBadge ---
// Badge específico para el estado de la cuenta por pagar
const EstadoCuentaBadge = ({ estado }) => {
  let classes = 'bg-gray-100 text-gray-800'; // Default
  let text = estado.charAt(0).toUpperCase() + estado.slice(1); // Capitalize

  switch (estado) {
    case 'pendiente':
      classes = 'bg-yellow-100 text-yellow-800';
      break;
    case 'pagado':
      classes = 'bg-green-100 text-green-800';
      break;
    case 'vencido': // Podrías añadir lógica para calcular esto
      classes = 'bg-red-100 text-red-800';
      text = 'Vencido'; // Opcional, si el backend no lo calcula
      break;
    default:
      break;
  }

  return (
    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${classes}`}>
      {text}
    </span>
  );
};


export const ListarCuentasPorPagar = () => {
  const [cuentas, setCuentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [alertInfo, setAlertInfo] = useState({ type: null, message: null, details: [] });

  // Estados para Modal Info
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [selectedCuentaIdInfo, setSelectedCuentaIdInfo] = useState(null);
  
  // --- NUEVOS ESTADOS PARA MODAL PAGO ---
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedCuentaPago, setSelectedCuentaPago] = useState(null); // Guarda el objeto cuenta completo

  // Función para recargar la lista
  const reloadCuentas = () => {
     fetchCuentas(pagination.currentPage); // Llama a la función que ya tenías
  };

  // fetchCuentas (se queda igual, solo lo muevo aquí para claridad)
  const fetchCuentas = async (page) => {
    setLoading(true);
    setError(null);
    // No limpiar alerta aquí si viene de un pago exitoso
    // setAlertInfo({ type: null, message: null, details: [] }); 
    try {
      const response = await getCuentasPorPagar(page);
      if (response.current_page !== undefined) {
        setCuentas(response.data); 
        setPagination({ currentPage: response.current_page, totalPages: response.last_page });
      } else {
        console.warn("Respuesta inesperada de getCuentasPorPagar, usando Plan B");
        setCuentas(response.data.data); 
        setPagination({ currentPage: response.data.current_page, totalPages: response.data.last_page });
      }
    } catch (err) {
      console.error("Error al cargar cuentas por pagar:", err); 
      setError(err.message || 'No se pudo cargar la lista de cuentas por pagar.'); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCuentas(pagination.currentPage); 
  }, [pagination.currentPage]);

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  // Handlers Modal Info
  const handleOpenInfoModal = (id) => {
    setSelectedCuentaIdInfo(id);
    setIsInfoModalOpen(true);
  };
  const handleCloseInfoModal = () => {
    setSelectedCuentaIdInfo(null);
    setIsInfoModalOpen(false);
  };

  // --- NUEVOS HANDLERS MODAL PAGO ---
  const handleOpenPaymentModal = (cuenta) => {
    setSelectedCuentaPago(cuenta); // Guarda el objeto completo
    setIsPaymentModalOpen(true);
  };
  const handleClosePaymentModal = () => {
    setSelectedCuentaPago(null);
    setIsPaymentModalOpen(false);
  };
  // Callback que se ejecuta cuando el pago es exitoso en el modal
  const handlePaymentSuccess = () => {
    // Muestra mensaje de éxito (opcional, el modal ya lo muestra)
    setAlertInfo({ type: 'success', message: 'Pago registrado con éxito. Actualizando lista...', details: []});
    reloadCuentas(); // Recarga la lista
  };


  if (loading) {
    return <div className="text-center p-8 text-gray-500">Cargando cuentas por pagar...</div>;
  }
  if (error) {
    return <div className="p-4 bg-red-50 text-red-800 rounded-md border border-red-200">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-4">
        Lista de Cuentas por Pagar
      </h2>
      
      <AlertMessage
        type={alertInfo.type}
        message={alertInfo.message}
        details={alertInfo.details}
        onClose={() => setAlertInfo({ type: null, message: null, details: [] })}
      />
      
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full divide-y divide-gray-200">
          {/* thead se queda igual */}
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proveedor</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto Total</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto Pagado</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Vencimiento</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cuentas.length > 0 ? (
              cuentas.map((cuenta) => {
                const montoTotal = parseFloat(cuenta.egreso?.monto || 0);
                const montoPagado = parseFloat(cuenta.monto_pagado || 0);
                const saldoPendiente = montoTotal - montoPagado;

                return (
                  <tr key={cuenta.id}>
                    {/* Columnas de datos se quedan igual */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {cuenta.egreso?.proveedor?.nombre || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      S/ {montoTotal.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      S/ {montoPagado.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(cuenta.fecha_vencimiento + 'T00:00:00').toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <EstadoCuentaBadge estado={cuenta.estado} />
                    </td>

                    {/* Acciones Modificadas */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                      <button
                        onClick={() => handleOpenInfoModal(cuenta.id)} // Llama al modal de Info
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Ver
                      </button>
                      
                      {/* --- BOTÓN PAGAR MODIFICADO --- */}
                      {/* Usa un botón que abre el PaymentModal */}
                      {cuenta.estado === 'pendiente' && saldoPendiente > 0 && (
                        <button 
                          onClick={() => handleOpenPaymentModal(cuenta)} // Pasa el objeto cuenta completo
                          className="text-green-600 hover:text-green-900"
                        >
                          Pagar
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                  No se encontraron cuentas por pagar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {cuentas.length > 0 && ( 
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {/* Renderizar Modal Info */}
      <ModalInfoCuentaPorPagar
        isOpen={isInfoModalOpen}
        onClose={handleCloseInfoModal}
        cuentaId={selectedCuentaIdInfo}
      />
      
      {/* --- RENDERIZAR MODAL PAGO --- */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={handleClosePaymentModal}
        cuentaData={selectedCuentaPago} // Pasa el objeto cuenta
        onPaymentSuccess={handlePaymentSuccess} // Pasa el callback de éxito
      />

    </div>
  );
};

export default ListarCuentasPorPagar;
