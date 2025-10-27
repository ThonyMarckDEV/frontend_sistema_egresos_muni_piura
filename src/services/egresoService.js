import { fetchWithAuth } from 'js/authToken';
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse';

/**
 * Envía los datos de un nuevo egreso al backend.
 * @param {object} egresoData - Objeto con { monto, categoria_id, proveedor_id, descripcion }
 */
export const createEgreso = async (egresoData) => {
  // Ruta: /api/egreso/store
  const response = await fetchWithAuth(`${API_BASE_URL}/api/egreso/store`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(egresoData)
  });
  return handleResponse(response);
};

/**
 * Obtiene una lista paginada de egresos.
 * @param {number} page - El número de página a solicitar.
 */
export const getEgresos = async (page = 1) => {
  // Ruta: /api/egresos
  const response = await fetchWithAuth(`${API_BASE_URL}/api/egresos?page=${page}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  });
  return handleResponse(response);
};

/**
 * Obtiene los datos de un egreso específico por su ID.
 * @param {string|number} id - El ID del egreso.
 */
export const getEgresoById = async (id) => {
  // Ruta: /api/egreso/{id}
  const response = await fetchWithAuth(`${API_BASE_URL}/api/egreso/${id}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  });
  return handleResponse(response);
  
};

/**
 * Actualiza los datos de un egreso existente.
 * @param {string|number} id - El ID del egreso.
 * @param {object} egresoData - Objeto con los datos a actualizar.
 */
export const updateEgreso = async (id, egresoData) => {
  // Ruta: /api/egreso/{id}
  const response = await fetchWithAuth(`${API_BASE_URL}/api/egreso/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(egresoData)
  });
  return handleResponse(response);
};