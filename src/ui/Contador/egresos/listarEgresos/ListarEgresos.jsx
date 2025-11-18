import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEgresos } from 'services/egresoService';
import Pagination from 'components/Shared/Pagination';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ModalInfoEgreso from '../components/modals/ModalInfoEgreso';
import ReportButton from 'components/Shared/ReportButton';

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
      // Limpiamos alerta solo al cargar inicialmente o cambiar de página
      if(alertInfo.type !== 'success') { // No limpiar si viene de una acción exitosa
        setAlertInfo({ type: null, message: null, details: [] });
      }
      try {
        const response = await getEgresos(page);

        if (response.current_page !== undefined) {
          setEgresos(response.data);
          setPagination({
            currentPage: response.current_page,
            totalPages: response.last_page,
          });
        } else {
          console.warn("Respuesta inesperada de getEgresos, intentando Plan B");
          setEgresos(response.data?.data || []); // Asegura que sea array
          setPagination({
            currentPage: response.data?.current_page || 1,
            totalPages: response.data?.last_page || 1,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.currentPage]); // Dependencia correcta

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

  if (loading && egresos.length === 0) { // Muestra carga solo la primera vez
    return <div className="text-center p-8 text-gray-500">Cargando egresos...</div>;
  }

  if (error) {
    return <div className="p-4 bg-red-50 text-red-800 rounded-md border border-red-200">{error}</div>;
  }

  // 'header' es el título en el PDF, 'dataKey' es la clave en el objeto de datos.
  const reportColumns = [
    { header: 'ID', dataKey: 'id' },
    { header: 'Monto', dataKey: 'monto' },
    { header: 'Categoría', dataKey: 'categoria' },
    { header: 'Proveedor', dataKey: 'proveedor' },
    { header: 'Fecha', dataKey: 'fecha' },
  ];

  // Mapea tus datos 'egresos' al formato exacto que necesita el PDF.
  // Esto es importante para formatear moneda, fechas y manejar objetos anidados.
  const reportData = egresos.map((egreso) => ({
    id: egreso.id,
    monto: `S/ ${parseFloat(egreso.monto).toFixed(2)}`,
    categoria: egreso.categoria ? egreso.categoria.nombre : 'N/A',
    proveedor: egreso.proveedor ? egreso.proveedor.nombre : 'N/A',
    fecha: new Date(egreso.created_at).toLocaleDateString('es-PE'),
  }));

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">

      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Lista de Egresos
        </h2>

      <ReportButton
          title="Reporte de Egresos"
          columns={reportColumns}
          data={reportData}
          cookieUsername="username" // Opcional: cambia si tu cookie se llama diferente
        />
      </div>

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

                    {/* Condicional para Editar */}
                    {!egreso.cuenta_por_pagar && (
                      <Link
                        to={`/contador/editar-egreso/${egreso.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Editar
                      </Link>
                    )}

                    {/* Condicional para Registrar Cta. Pagar */}
                    {egreso.proveedor && !egreso.cuenta_por_pagar && (
                      <Link
                        to={`/contador/egreso/registrar-cuenta-por-pagar/${egreso.id}`}
                        className="text-red-600 hover:text-red-900"
                      >
                        Registrar Cta. Pagar
                      </Link>
                    )}
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

      {egresos.length > 0 && pagination.totalPages > 1 && (
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