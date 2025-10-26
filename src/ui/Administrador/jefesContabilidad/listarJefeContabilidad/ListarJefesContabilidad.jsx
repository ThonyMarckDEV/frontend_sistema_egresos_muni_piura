import React, { useState, useEffect } from 'react';
// 1. Importar el servicio correcto
import { getJefesContabilidad } from 'services/jefeContabilidadService';
import Pagination from 'components/Shared/Pagination';
import { Link } from 'react-router-dom';

// 2. Importar el MODAL correcto
import ModalInfoJefeContabilidad from '../components/modals/ModalInfoJefeContabilidad'; 

// El componente EstadoBadge es reutilizable, se queda
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

// 3. Cambiar nombre del componente
export const ListarJefesContabilidad = () => {
  // 4. Cambiar nombres de variables de estado
  const [jefes, setJefes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  // 5. Cambiar nombre de variable de estado
  const [selectedJefeId, setSelectedJefeId] = useState(null);

  useEffect(() => {
    // 6. Cambiar nombre de función
    const fetchJefes = async (page) => {
      setLoading(true);
      setError(null);
      try {
        // 7. Llamar al servicio correcto
        const response = await getJefesContabilidad(page);
        
        if (response.current_page !== undefined) {
            // 8. Usar setJefes
            setJefes(response.data); 
            setPagination({
              currentPage: response.current_page,
              totalPages: response.last_page,
            });
        } else {
            console.warn("Respuesta inesperada de getJefesContabilidad, intentando Plan B");
            // 9. Usar setJefes
            setJefes(response.data.data);
            setPagination({
              currentPage: response.data.current_page,
              totalPages: response.data.last_page,
            });
        }

      } catch (err) {
        console.error("Error al cargar jefes de contabilidad:", err);
        // 10. Cambiar mensaje de error
        setError(err.message || 'No se pudo cargar la lista de jefes de contabilidad.');
      } finally {
        setLoading(false);
      }
    };

    // 11. Llamar a la función
    fetchJefes(pagination.currentPage);
  }, [pagination.currentPage]);

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const handleOpenModal = (id) => {
    // 12. Usar setSelectedJefeId
    setSelectedJefeId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    // 13. Usar setSelectedJefeId
    setSelectedJefeId(null);
    setIsModalOpen(false);
  };

  if (loading) {
    // 14. Cambiar texto
    return <div className="text-center p-8 text-gray-500">Cargando jefes de contabilidad...</div>;
  }

  if (error) {
    return <div className="p-4 bg-red-50 text-red-800 rounded-md border border-red-200">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-4">
        {/* 15. Cambiar Título */}
        Lista de Jefes de Contabilidad
      </h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {/* Las cabeceras son las mismas */}
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre Completo</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DNI</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* 16. Mapear sobre 'jefes' */}
            {jefes.length > 0 ? (
              jefes.map((jefe) => (
                <tr key={jefe.id}>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {jefe.username}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {jefe.datos ? `${jefe.datos.nombre} ${jefe.datos.apellidoPaterno} ${jefe.datos.apellidoMaterno}` : 'N/A'}
                  </td>

                  <td className="px-6 py-4 whitespace-nowTwrap text-sm text-gray-500">
                    {jefe.datos ? jefe.datos.dni : 'N/A'}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <EstadoBadge estado={jefe.estado} />
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                    <button
                      onClick={() => handleOpenModal(jefe.id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Ver
                    </button>
                    {/* 17. Cambiar la ruta de edición */}
                    <Link to={`/admin/editar-jefe-contabilidad/${jefe.id}`} className="text-indigo-600 hover:text-indigo-900">
                      Editar
                    </Link>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                  {/* 18. Cambiar texto */}
                  No se encontraron jefes de contabilidad.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 19. Usar 'jefes.length' */}
      {jefes.length > 0 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {/* 20. Renderizar el MODAL correcto y pasar la prop correcta */}
      <ModalInfoJefeContabilidad
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        jefeId={selectedJefeId}
      />
    </div>
  );
};

// 21. Cambiar export default
export default ListarJefesContabilidad;