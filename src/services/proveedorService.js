import { fetchWithAuth } from 'js/authToken';
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse';

/**
 * Envía los datos de un nuevo proveedor al backend.
 * @param {object} proveedorData - Objeto con { nombre, ruc, dni, descripcion, estado }
 */
export const createProveedor = async (proveedorData) => {
  // Ruta: /api/proveedor/store (basado en tu ProveedorController)
  const response = await fetchWithAuth(`${API_BASE_URL}/api/proveedor/store`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(proveedorData)
  });
  return handleResponse(response);
};

/**
 * Obtiene una lista paginada de proveedores.
 * @param {number} page - El número de página a solicitar.
 */
export const getProveedores = async (page = 1) => {
  // Ruta: /api/proveedores (basado en tu ProveedorController)
  const response = await fetchWithAuth(`${API_BASE_URL}/api/proveedores?page=${page}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  });
  return handleResponse(response);
};

/**
 * NUEVA FUNCIÓN: Obtiene la lista COMPLETA de proveedores.
 * Llama a la ruta /api/proveedores/all
 */
export const getAllProveedores = async () => {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/proveedores/all`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  });
  
  // Asumo que handleResponse devuelve el array
  return handleResponse(response);
};

/**
 * Obtiene los datos de un proveedor específico por su ID.
 * @param {string|number} id - El ID del proveedor.
 */
export const getProveedorById = async (id) => {
  // Ruta: /api/proveedor/{id} (basado en tu ProveedorController)
  const response = await fetchWithAuth(`${API_BASE_URL}/api/proveedor/${id}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  });
  return handleResponse(response);
  
};

/**
 * Actualiza los datos de un proveedor existente.
 * @param {string|number} id - El ID del proveedor.
 * @param {object} proveedorData - Objeto con { nombre, ruc, dni, descripcion, estado }
 */
export const updateProveedor = async (id, proveedorData) => {
  // Ruta: /api/proveedor/{id} (basado en tu ProveedorController)
  const response = await fetchWithAuth(`${API_BASE_URL}/api/proveedor/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(proveedorData)
  });
  return handleResponse(response);
};