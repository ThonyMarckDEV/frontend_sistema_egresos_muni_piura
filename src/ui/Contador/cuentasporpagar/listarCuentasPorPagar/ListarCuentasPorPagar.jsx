import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// 1. Importar servicio de Cuentas por Pagar
import { getCuentasPorPagar } from 'services/cuentaPorPagarService'; 
import Pagination from 'components/Shared/Pagination';
import AlertMessage from 'components/Shared/Errors/AlertMessage';

// --- NUEVA IMPORTACIÓN ---
// Importa el modal para Cuentas por Pagar (que crearemos después)
import ModalInfoCuentaPorPagar from '../components/modals/ModalInfoCuentasPorPagar'; 

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

// 2. Nombre del componente
export const ListarCuentasPorPagar = () => {
  // 3. Estado adaptado
  const [cuentas, setCuentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  const [alertInfo, setAlertInfo] = useState({ type: null, message: null, details: [] });

  // --- Estados para el Modal ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCuentaId, setSelectedCuentaId] = useState(null);

  useEffect(() => {
    // 4. Nombre de función adaptado
    const fetchCuentas = async (page) => {
      setLoading(true);
      setError(null);
      setAlertInfo({ type: null, message: null, details: [] }); 
      try {
        // 5. Llamar al servicio correcto
        const response = await getCuentasPorPagar(page);
        
        // El backend ya devuelve la estructura paginada
        if (response.current_page !== undefined) {
          setCuentas(response.data); 
          setPagination({
            currentPage: response.current_page,
            totalPages: response.last_page,
          });
        } else {
          console.warn("Respuesta inesperada de getCuentasPorPagar, usando Plan B");
          setCuentas(response.data.data); 
          setPagination({
            currentPage: response.data.current_page,
            totalPages: response.data.last_page,
          });
        }
      } catch (err) {
        console.error("Error al cargar cuentas por pagar:", err); 
        setError(err.message || 'No se pudo cargar la lista de cuentas por pagar.'); 
      } finally {
        setLoading(false);
      }
    };

    fetchCuentas(pagination.currentPage); 
  }, [pagination.currentPage]);

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  // --- Handlers para el Modal ---
  const handleOpenModal = (id) => {
    setSelectedCuentaId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedCuentaId(null);
    setIsModalOpen(false);
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
          <thead className="bg-gray-50">
            <tr>
              {/* 7. Cabeceras adaptadas para Cuentas por Pagar */}
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proveedor</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto Total</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto Pagado</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Vencimiento</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* 8. Mapear sobre 'cuentas' */}
            {cuentas.length > 0 ? (
              cuentas.map((cuenta) => {
                // Calcula el saldo pendiente
                const montoTotal = parseFloat(cuenta.egreso?.monto || 0);
                const montoPagado = parseFloat(cuenta.monto_pagado || 0);
                const saldoPendiente = montoTotal - montoPagado;

                return (
                  <tr key={cuenta.id}>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {/* Accedemos al proveedor a través del egreso */}
                      {cuenta.egreso?.proveedor?.nombre || 'N/A'}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      S/ {montoTotal.toFixed(2)}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      S/ {montoPagado.toFixed(2)}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(cuenta.fecha_vencimiento + 'T00:00:00').toLocaleDateString()} {/* Asegura formato correcto */}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <EstadoCuentaBadge estado={cuenta.estado} />
                    </td>

                    {/* 9. Acciones adaptadas */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                      <button
                        onClick={() => handleOpenModal(cuenta.id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Ver
                      </button>
                      {/* Solo muestra "Pagar" si el estado es 'pendiente' */}
                      {cuenta.estado === 'pendiente' && saldoPendiente > 0 && (
                        <Link 
                          // Cambia esta ruta a tu página/componente de registro de pagos
                          to={`/contador/pagar-cuenta/${cuenta.id}`} 
                          className="text-green-600 hover:text-green-900"
                        >
                          Pagar
                        </Link>
                      )}
                    </td>

                  </tr>
                )
              })
            ) : (
              <tr>
                {/* 10. Colspan adaptado (6 columnas) */}
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

      {/* --- Renderizar el Modal --- */}
      <ModalInfoCuentaPorPagar
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        cuentaId={selectedCuentaId}
      />

    </div>
  );
};

export default ListarCuentasPorPagar;