import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// 1. Importar servicios de proveedor
import { getProveedores } from 'services/proveedorService'; 
import Pagination from 'components/Shared/Pagination';
import AlertMessage from 'components/Shared/Errors/AlertMessage';

// --- NUEVA IMPORTACIÓN ---
// Importa el modal que acabamos de crear (ajusta la ruta si es necesario)
import ModalInfoProveedor from '../components/modals/ModalInfoProveedor'; 

// El componente EstadoBadge es reutilizable
const EstadoBadge = ({ estado }) => {
  const classes = estado === 1
    ? 'bg-green-100 text-green-800'
    : 'bg-red-100 text-red-800';

  return (
    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${classes}`}>
      {estado === 1 ? 'Activo' : 'Inactivo'}
    </span>
  );
};

// 2. Nombre del componente
export const ListarProveedores = () => {
  // 3. Estado adaptado
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  const [alertInfo, setAlertInfo] = useState({ type: null, message: null, details: [] });

  // --- NUEVOS ESTADOS PARA EL MODAL ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProveedorId, setSelectedProveedorId] = useState(null);

  useEffect(() => {
    // 4. Nombre de función adaptado
    const fetchProveedores = async (page) => {
      setLoading(true);
      setError(null);
      setAlertInfo({ type: null, message: null, details: [] }); 
      try {
        // 5. Llamar al servicio correcto
        const response = await getProveedores(page);
        
        if (response.current_page !== undefined) {
          setProveedores(response.data); 
          setPagination({
            currentPage: response.current_page,
            totalPages: response.last_page,
          });
        } else {
          console.warn("Respuesta inesperada de getProveedores, intentando Plan B");
          setProveedores(response.data.data); 
          setPagination({
            currentPage: response.data.current_page,
            totalPages: response.data.last_page,
          });
        }
      } catch (err) {
        console.error("Error al cargar proveedores:", err); 
        setError(err.message || 'No se pudo cargar la lista de proveedores.'); 
      } finally {
        setLoading(false);
      }
    };

    fetchProveedores(pagination.currentPage); 
  }, [pagination.currentPage]);

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  // --- NUEVOS HANDLERS PARA EL MODAL ---
  const handleOpenModal = (id) => {
    setSelectedProveedorId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedProveedorId(null);
    setIsModalOpen(false);
  };

  if (loading) {
    return <div className="text-center p-8 text-gray-500">Cargando proveedores...</div>;
  }

  if (error) {
    return <div className="p-4 bg-red-50 text-red-800 rounded-md border border-red-200">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-4">
        Lista de Proveedores
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
              {/* 7. Cabeceras adaptadas para Proveedor */}
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre / Razón Social</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documento</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* 8. Mapear sobre 'proveedores' */}
            {proveedores.length > 0 ? (
              proveedores.map((proveedor) => (
                <tr key={proveedor.id}>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {proveedor.nombre}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {proveedor.ruc ? `RUC: ${proveedor.ruc}` : (proveedor.dni ? `DNI: ${proveedor.dni}` : 'N/A')}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <EstadoBadge estado={proveedor.estado} />
                  </td>

                  {/* --- ACCIONES CORREGIDAS --- */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                    {/* Botón "Ver" que abre el modal */}
                    <button
                      onClick={() => handleOpenModal(proveedor.id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Ver
                    </button>
                    {/* Link "Editar" (ruta del ejemplo) */}
                    <Link to={`/jefe_contabilidad/editar-proveedor/${proveedor.id}`} className="text-indigo-600 hover:text-indigo-900">
                      Editar
                    </Link>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                {/* 10. Colspan adaptado (4 columnas) */}
                <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                  No se encontraron proveedores.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {proveedores.length > 0 && ( 
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {/* --- RENDERIZAR EL MODAL --- */}
      <ModalInfoProveedor
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        proveedorId={selectedProveedorId}
      />

    </div>
  );
};

export default ListarProveedores;