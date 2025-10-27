import React, { useState, useEffect } from 'react';
import { getAllCategorias } from 'services/categoriaService'; 

const CategoriaSelect = ({ value, onChange, errors, disabled }) => {
    const [allCategorias, setAllCategorias] = useState([]); 
    const [filteredCategorias, setFilteredCategorias] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);
    const error = errors.id_Categoria; 

    useEffect(() => {
        const fetchAllCategorias = async () => {
            try {
                const response = await getAllCategorias(); 
                const dataArray = Array.isArray(response) ? response : (response.data || []);
                setAllCategorias(dataArray);
                setFilteredCategorias(dataArray);
            } catch (err) {
                console.error("Error al cargar categorías:", err);
                setErrorMsg('Error al cargar la lista de categorías.');
            } finally {
                setLoading(false);
            }
        };
        fetchAllCategorias();
    }, []); 

    useEffect(() => {
        if (!searchTerm) {
            setFilteredCategorias(allCategorias);
        } else {
            const filtradas = allCategorias.filter(categoria =>
                categoria.nombre.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredCategorias(filtradas);
        }
    }, [searchTerm, allCategorias]); 

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    if (loading) {
        return (
            <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Categoría</label>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Cargando categorías..."
                        disabled
                        className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:cursor-not-allowed"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                </div>
            </div>
        );
    }
    
    if (errorMsg) {
        return (
            <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Categoría</label>
                <div className="p-3 border border-red-300 bg-red-50 rounded-lg text-red-600 text-sm">
                    {errorMsg}
                </div>
            </div>
        );
    }

    return (
        <div className="relative">
            <label htmlFor="id_Categoria" className="block text-sm font-semibold text-gray-700 mb-2">
                Categoría
            </label>
            
            <input
                type="text"
                placeholder="Escribe para filtrar categorías..."
                value={searchTerm}
                onChange={handleSearchChange}
                disabled={disabled || loading}
                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed mb-3 transition-colors duration-200"
            />
            
            <select
                id="id_Categoria"
                name="id_Categoria"
                value={value}
                onChange={onChange}
                className={`w-full px-4 py-3 border-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                    error 
                        ? 'border-red-500 bg-red-50 text-red-900' 
                        : 'border-gray-300 hover:border-gray-400 focus:border-blue-500'
                }`}
                disabled={disabled}
            >
                <option value="" disabled>Seleccione una categoría</option>
                {filteredCategorias.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>
                        {categoria.nombre}
                    </option>
                ))}
                {filteredCategorias.length === 0 && searchTerm && (
                    <option value="" disabled className="text-gray-500">
                        No se encontraron coincidencias para "{searchTerm}"
                    </option>
                )}
            </select>
            {error && <p className="text-red-600 text-xs mt-1 font-medium">{error}</p>}
        </div>
    );
};

export default CategoriaSelect;