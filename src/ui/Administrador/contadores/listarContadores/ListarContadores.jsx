import React, { useState, useEffect } from 'react';
import { getContadores } from 'services/contadorService';
import Pagination from 'components/Shared/Pagination';
import { Link } from 'react-router-dom';

import ModalInfoContador from '../components/modals/ModalInfoContador'; 

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

// Componente principal para listar
export const ListarContadores = () => {
  const [contadores, setContadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  // --- NUEVO ESTADO PARA EL MODAL ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContadorId, setSelectedContadorId] = useState(null);

  // Hook para cargar los datos cuando cambia la página
  useEffect(() => {
    const fetchContadores = async (page) => {
      setLoading(true);
      setError(null);
      try {
        const response = await getContadores(page);
        
        // Asumiendo que getContadores devuelve el objeto de paginación
        // y NO está envuelto por handleResponse (como dijiste en un prompt anterior)
        if (response.current_page !== undefined) {
            setContadores(response.data); 
            setPagination({
              currentPage: response.current_page,
              totalPages: response.last_page,
            });
        } else {
            // Plan B por si acaso 'getContadores' SÍ usa handleResponse
            // y devuelve { data: { data: [...], current_page: ... } }
            console.warn("Respuesta inesperada de getContadores, intentando Plan B");
            setContadores(response.data.data);
            setPagination({
              currentPage: response.data.current_page,
              totalPages: response.data.last_page,
            });
        }

      } catch (err) {
        console.error("Error al cargar contadores:", err);
        setError(err.message || 'No se pudo cargar la lista de contadores.');
      } finally {
        setLoading(false);
      }
    };

    fetchContadores(pagination.currentPage);
  }, [pagination.currentPage]);

  // Handler para la paginación
  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  // --- NUEVOS HANDLERS PARA EL MODAL ---
  const handleOpenModal = (id) => {
    setSelectedContadorId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedContadorId(null);
  };

  // Renderizado condicional (Cargando)
  if (loading) {
    return <div className="text-center p-8 text-gray-500">Cargando contadores...</div>;
  }

  // Renderizado condicional (Error)
  if (error) {
    return <div className="p-4 bg-red-50 text-red-800 rounded-md border border-red-200">{error}</div>;
  }

  // Renderizado principal
  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-4">
        Lista de Contadores
      </h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre Completo</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DNI</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {contadores.length > 0 ? (
              contadores.map((contador) => (
                <tr key={contador.id}>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {contador.username}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {contador.datos ? `${contador.datos.nombre} ${contador.datos.apellidoPaterno} ${contador.datos.apellidoMaterno}` : 'N/A'}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {contador.datos ? contador.datos.dni : 'N/A'}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <EstadoBadge estado={contador.estado} />
                  </td>

                  {/* --- SECCIÓN DE ACCIONES MODIFICADA --- */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                    <button
                      onClick={() => handleOpenModal(contador.id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Ver
                    </button>
                    <Link to={`/admin/editar-contador/${contador.id}`} className="text-indigo-600 hover:text-indigo-900">
                      Editar
                    </Link>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                  No se encontraron contadores.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Componente de Paginación */}
      {contadores.length > 0 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {/* --- RENDERIZADO DEL MODAL --- */}
      <ModalInfoContador
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        contadorId={selectedContadorId}
      />
    </div>
  );
};

export default ListarContadores;