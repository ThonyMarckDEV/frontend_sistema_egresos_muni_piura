import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// 1. Importar servicios de categoria
import { getCategorias, deleteCategoria } from 'services/categoriaService'; 
import Pagination from 'components/Shared/Pagination';
import AlertMessage from 'components/Shared/Errors/AlertMessage'; // Para los mensajes de eliminación

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

export const ListarCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  // Estado para forzar la recarga de datos después de eliminar
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  // Estado para mensajes de éxito/error al eliminar
  const [alertInfo, setAlertInfo] = useState({ type: null, message: null, details: [] });

  useEffect(() => {
    const fetchCategorias = async (page) => {
      setLoading(true);
      setError(null);
      // Limpiamos la alerta en cada recarga
      setAlertInfo({ type: null, message: null, details: [] }); 
      try {
        // 2. Llamar al servicio correcto
        const response = await getCategorias(page);
        
        // Esta lógica de paginación (con Plan B) se mantiene por si acaso
        if (response.current_page !== undefined) {
          setCategorias(response.data); 
          setPagination({
            currentPage: response.current_page,
            totalPages: response.last_page,
          });
        } else {
          console.warn("Respuesta inesperada de getCategorias, intentando Plan B");
          setCategorias(response.data.data);
          setPagination({
            currentPage: response.data.current_page,
            totalPages: response.data.last_page,
          });
        }

      } catch (err) {
        console.error("Error al cargar categorías:", err);
        setError(err.message || 'No se pudo cargar la lista de categorías.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategorias(pagination.currentPage);
  }, [pagination.currentPage, refreshTrigger]); // Se refresca si cambia la página O si forzamos el refresh

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  // 3. NUEVO: Handler para eliminar
  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      return;
    }

    try {
      const response = await deleteCategoria(id);
      setAlertInfo({
        type: 'success',
        message: response.message || 'Categoría eliminada exitosamente.',
      });
      // Forzamos el refresh de los datos
      setRefreshTrigger(prev => prev + 1); 
    } catch (err) {
      console.error("Error al eliminar categoría:", err);
      setAlertInfo({
        type: 'error',
        message: err.message,
        details: err.details || []
      });
    }
  };


  if (loading) {
    return <div className="text-center p-8 text-gray-500">Cargando categorías...</div>;
  }

  if (error) {
    return <div className="p-4 bg-red-50 text-red-800 rounded-md border border-red-200">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-4">
        Lista de Categorías
      </h2>
      
      {/* Alerta para mensajes de eliminación */}
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
              {/* 4. Cabeceras simplificadas */}
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* 5. Mapear sobre 'categorias' */}
            {categorias.length > 0 ? (
              categorias.map((categoria) => (
                <tr key={categoria.id}>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {categoria.nombre}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <EstadoBadge estado={categoria.estado} />
                  </td>

                  {/* 6. Acciones actualizadas (sin "Ver", con "Eliminar") */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                    <Link to={`/contador/editar-categoria/${categoria.id}`} className="text-indigo-600 hover:text-indigo-900">
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(categoria.id)}
                      className="text-red-600 hover:text-red-900"
                      disabled={loading} // Deshabilitar si se está cargando la lista
                    >
                      Eliminar
                    </button>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                  No se encontraron categorías.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {categorias.length > 0 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {/* 7. Modal eliminado */}
    </div>
  );
};

export default ListarCategorias;