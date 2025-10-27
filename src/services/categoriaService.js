import { fetchWithAuth } from 'js/authToken';
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse';

/**
 * Envía los datos de una nueva categoría al backend.
 * @param {object} categoriaData - Objeto con { nombre, estado }
 */
export const createCategoria = async (categoriaData) => {
  // Ruta: /api/categoria/store
  const response = await fetchWithAuth(`${API_BASE_URL}/api/categoria/store`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(categoriaData)
  });
  return handleResponse(response);
};

/**
 * Obtiene una lista paginada de categorías.
 * @param {number} page - El número de página a solicitar.
 */
export const getCategorias = async (page = 1) => {
  // Ruta: /api/categorias
  const response = await fetchWithAuth(`${API_BASE_URL}/api/categorias?page=${page}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  });
  return handleResponse(response);
};

/**
 * Obtiene los datos de una categoría específica por su ID.
 * @param {string|number} id - El ID de la categoría.
 */
export const getCategoriaById = async (id) => {
  // Ruta: /api/categoria/{id}
  const url = `${API_BASE_URL}/api/categoria/${id}`;
  const response = await fetchWithAuth(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  });
  return handleResponse(response);
};

/**
 * Actualiza los datos de una categoría existente.
 * @param {string|number} id - El ID de la categoría.
 * @param {object} categoriaData - Objeto con { nombre, estado }
 */
export const updateCategoria = async (id, categoriaData) => {
  // Ruta: /api/categoria/{id}
  const url = `${API_BASE_URL}/api/categoria/${id}`;
  
  const response = await fetchWithAuth(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(categoriaData)
  });
  return handleResponse(response);
};

/**
 * Elimina una categoría.
 * @param {string|number} id - El ID de la categoría.
 */
export const deleteCategoria = async (id) => {
  // Ruta: /api/categoria/{id}
  const url = `${API_BASE_URL}/api/categoria/${id}`;
  
  const response = await fetchWithAuth(url, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json'
    }
  });
  return handleResponse(response);
};