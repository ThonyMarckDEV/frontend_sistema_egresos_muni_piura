import React, { useState, useEffect } from 'react';
// 1. Importa la *nueva* función que trae TODAS
import { getAllCategorias } from 'services/categoriaService'; 

const CategoriaSelect = ({ value, onChange, errors, disabled }) => {
    
    const [allCategorias, setAllCategorias] = useState([]); 
    const [filteredCategorias, setFilteredCategorias] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);
    const error = errors.id_Categoria; 

    // 3. Carga TODAS las categorías UNA SOLA VEZ al inicio
    useEffect(() => {
        const fetchAllCategorias = async () => {
            try {
                // --- INICIO DE LA CORRECCIÓN ---

                // 'response' es el objeto que viene del service (ej: { data: [...] })
                const response = await getAllCategorias(); 
                
                // Si la respuesta es un array, úsalo. Si es un objeto, busca 'response.data'.
                // Si no es nada, usa un array vacío [].
                const dataArray = Array.isArray(response) ? response : (response.data || []);
                
                setAllCategorias(dataArray);
                setFilteredCategorias(dataArray);

                // --- FIN DE LA CORRECCIÓN ---

            } catch (err) {
                console.error("Error al cargar categorías:", err);
                setErrorMsg('Error al cargar la lista de categorías.');
            } finally {
                setLoading(false);
            }
        };
        fetchAllCategorias();
    }, []); // Array vacío, solo se ejecuta 1 vez

    
    // 4. Este efecto se ejecuta CADA VEZ que el usuario escribe
    useEffect(() => {
        if (!searchTerm) {
            setFilteredCategorias(allCategorias);
        } else {
            // Esta parte ya estaba bien, porque 'allCategorias' AHORA sí es un array
            const filtradas = allCategorias.filter(categoria =>
                categoria.nombre.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredCategorias(filtradas);
        }
    }, [searchTerm, allCategorias]); 

    // 5. El handler para el campo de búsqueda
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };


    if (loading) {
        return (
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <div className="p-2 border border-gray-300 bg-gray-100 rounded-md text-gray-500">
                    Cargando categorías...
                </div>
            </div>
        );
    }
    
    if (errorMsg) {
        return (
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <p className="text-red-500 text-sm mt-1">{errorMsg}</p>
            </div>
        );
    }

    return (
        <div>
            <label htmlFor="id_Categoria" className="block text-sm font-medium text-gray-700 mb-1">
                Categoría
            </label>
            
            {/* 6. CAMPO DE TEXTO PARA BUSCAR */}
            <input
                type="text"
                placeholder="Escribe para filtrar..."
                value={searchTerm}
                onChange={handleSearchChange}
                disabled={disabled || loading}
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100 mb-2"
            />
            
            {/* 7. El SELECT original (Esta línea ya no dará error) */}
            <select
                id="id_Categoria"
                name="id_Categoria"
                value={value}
                onChange={onChange}
                className={`w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100 ${error ? 'border-red-500' : ''}`}
                disabled={disabled}
            >
                <option value="" disabled>Seleccione Categoría</option>
                
                {/* Ahora 'filteredCategorias' es un array y .map() funciona */}
                {filteredCategorias.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>
                        {categoria.nombre}
                    </option>
                ))}

                {/* Mensaje si el filtro no encuentra nada */}
                {filteredCategorias.length === 0 && searchTerm && (
                    <option value="" disabled>
                        No se encontraron coincidencias para "{searchTerm}"
                    </option>
                )}
            </select>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
};

export default CategoriaSelect;