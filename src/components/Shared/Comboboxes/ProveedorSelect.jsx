import React, { useState, useEffect } from 'react';
// 1. Importar el servicio de PROVEEDOR
import { getAllProveedores } from 'services/proveedorService'; 

const ProveedorSelect = ({ value, onChange, errors, disabled }) => {
    
    // 2. Nombres de estado cambiados
    const [allProveedores, setAllProveedores] = useState([]); 
    const [filteredProveedores, setFilteredProveedores] = useState([]);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);
    // 3. Error adaptado
    const error = errors.id_Proveedor; 

    // Carga TODOS los proveedores UNA SOLA VEZ al inicio
    useEffect(() => {
        // 4. Nombre de función cambiado
        const fetchAllProveedores = async () => {
            try {
                // 5. Llamada al servicio de proveedor
                const response = await getAllProveedores(); 
                
                const dataArray = Array.isArray(response) ? response : (response.data || []);
                
                setAllProveedores(dataArray);
                setFilteredProveedores(dataArray);

            } catch (err) {
                console.error("Error al cargar proveedores:", err);
                setErrorMsg('Error al cargar la lista de proveedores.'); // 6. Mensaje cambiado
            } finally {
                setLoading(false);
            }
        };
        fetchAllProveedores();
    }, []); // Array vacío, solo se ejecuta 1 vez

    
    // 7. --- LÓGICA DE FILTRO MODIFICADA ---
    // Se ejecuta CADA VEZ que el usuario escribe
    useEffect(() => {
        if (!searchTerm) {
            setFilteredProveedores(allProveedores);
        } else {
            const searchLower = searchTerm.toLowerCase();

            const filtrados = allProveedores.filter(proveedor =>
                // Busca por nombre
                proveedor.nombre.toLowerCase().includes(searchLower) ||
                // Busca por RUC (si existe)
                (proveedor.ruc && proveedor.ruc.includes(searchTerm)) ||
                // Busca por DNI (si existe)
                (proveedor.dni && proveedor.dni.includes(searchTerm))
            );
            setFilteredProveedores(filtrados);
        }
    }, [searchTerm, allProveedores]); // Se re-ejecuta si cambia el texto o la lista original

    // El handler para el campo de búsqueda (se queda igual)
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Estados de Carga y Error (se quedan igual, solo cambia el texto)
    if (loading) {
        return (
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor</label>
                <div className="p-2 border border-gray-300 bg-gray-100 rounded-md text-gray-500">
                    Cargando proveedores...
                </div>
            </div>
        );
    }
    
    if (errorMsg) {
        return (
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor</label>
                <p className="text-red-500 text-sm mt-1">{errorMsg}</p>
            </div>
        );
    }

    // Renderizado del componente
    return (
        <div>
            {/* 8. Labels adaptados a Proveedor */}
            <label htmlFor="id_Proveedor" className="block text-sm font-medium text-gray-700 mb-1">
                Proveedor
            </label>
            
            {/* CAMPO DE TEXTO PARA BUSCAR (igual) */}
            <input
                type="text"
                placeholder="Filtrar por Nombre, RUC o DNI..."
                value={searchTerm}
                onChange={handleSearchChange}
                disabled={disabled || loading}
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100 mb-2"
            />
            
            {/* El SELECT adaptado */}
            <select
                id="id_Proveedor"
                name="id_Proveedor"
                value={value}
                onChange={onChange}
                className={`w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100 ${error ? 'border-red-500' : ''}`}
                disabled={disabled}
            >
                <option value="" disabled>Seleccione Proveedor</option>
                
                {/* 9. --- LÓGICA DE DISPLAY MODIFICADA --- */}
                {/* Mapea sobre los proveedores filtrados */}
                {filteredProveedores.map((proveedor) => {
                    // Crea el texto para la opción
                    let label = proveedor.nombre;
                    if (proveedor.ruc) {
                        label += ` (RUC: ${proveedor.ruc})`;
                    } else if (proveedor.dni) {
                        label += ` (DNI: ${proveedor.dni})`;
                    }

                    return (
                        <option key={proveedor.id} value={proveedor.id}>
                            {label}
                        </option>
                    );
                })}

                {/* Mensaje si el filtro no encuentra nada (igual) */}
                {filteredProveedores.length === 0 && searchTerm && (
                    <option value="" disabled>
                        No se encontraron coincidencias para "{searchTerm}"
                    </option>
                )}
            </select>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
};

export default ProveedorSelect;