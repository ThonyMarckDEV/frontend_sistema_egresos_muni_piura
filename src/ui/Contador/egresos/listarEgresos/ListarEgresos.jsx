import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEgresos } from 'services/egresoService'; 
import Pagination from 'components/Shared/Pagination';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ModalInfoEgreso from '../components/modals/ModalInfoEgreso'; 

export const ListarEgresos = () => {
  const [egresos, setEgresos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [alertInfo, setAlertInfo] = useState({ type: null, message: null, details: [] });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEgresoId, setSelectedEgresoId] = useState(null);

  useEffect(() => {
    const fetchEgresos = async (page) => {
      setLoading(true);
      setError(null);
      setAlertInfo({ type: null, message: null, details: [] }); 
      try {
        const response = await getEgresos(page);
        
        // El backend ahora incluye 'cuenta_por_pagar' en cada egreso
        if (response.current_page !== undefined) {
          setEgresos(response.data); 
          setPagination({
            currentPage: response.current_page,
            totalPages: response.last_page,
          });
        } else {
          console.warn("Respuesta inesperada de getEgresos, intentando Plan B");
          setEgresos(response.data.data); 
          setPagination({
            currentPage: response.data.current_page,
            totalPages: response.data.last_page,
          });
        }
      } catch (err) {
        console.error("Error al cargar egresos:", err); 
        setError(err.message || 'No se pudo cargar la lista de egresos.'); 
      } finally {
        setLoading(false);
      }
    };
    fetchEgresos(pagination.currentPage); 
  }, [pagination.currentPage]);

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const handleOpenModal = (id) => {
    setSelectedEgresoId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedEgresoId(null);
    setIsModalOpen(false);
  };

  if (loading) {
    return <div className="text-center p-8 text-gray-500">Cargando egresos...</div>;
  }

  if (error) {
    return <div className="p-4 bg-red-50 text-red-800 rounded-md border border-red-200">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-4">
        Lista de Egresos
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
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proveedor</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {egresos.length > 0 ? (
              egresos.map((egreso) => (
                <tr key={egreso.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {egreso.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    S/ {parseFloat(egreso.monto).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {egreso.categoria ? egreso.categoria.nombre : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {egreso.proveedor ? egreso.proveedor.nombre : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(egreso.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                    <button
                      onClick={() => handleOpenModal(egreso.id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Ver
                    </button>
                    <Link to={`/contador/editar-egreso/${egreso.id}`} className="text-indigo-600 hover:text-indigo-900">
                      Editar
                    </Link>

                    {/* --- CONDICIONAL PARA EL BOTÓN --- */}
                    {/* Solo muestra el link si: */}
                    {/* 1. El egreso TIENE proveedor */}
                    {/* 2. El egreso NO tiene una cuenta_por_pagar asociada (es null) */}
                    {egreso.proveedor && !egreso.cuenta_por_pagar && (
                      <Link 
                        to={`/contador/egreso/registrar-cuenta-por-pagar/${egreso.id}`} 
                        className="text-red-600 hover:text-red-900"
                      >
                        Registrar Cta. Pagar
                      </Link>
                    )}
                    {/* --- FIN DEL CONDICIONAL --- */}

                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                  No se encontraron egresos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {egresos.length > 0 && ( 
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}

      <ModalInfoEgreso
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        egresoId={selectedEgresoId}
      />
    </div>
  );
};

export default ListarEgresos;