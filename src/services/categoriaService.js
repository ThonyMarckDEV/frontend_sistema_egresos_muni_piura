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
 * NUEVA FUNCIÓN: Obtiene la lista COMPLETA de categorías.
 * Llama a la ruta /api/categorias/all
 */
export const getAllCategorias = async () => {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/categorias/all`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  });
  
  // Asumo que handleResponse devuelve el array
  return handleResponse(response);
};

/**
 * Obtiene los datos de una categoría específica por su ID.
 * @param {string|number} id - El ID de la categoría.
 */
export const getCategoriaById = async (id) => {

  const response = await fetchWithAuth(`${API_BASE_URL}/api/categoria/${id}`, {
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

  const response = await fetchWithAuth(`${API_BASE_URL}/api/categoria/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(categoriaData)
  });
  return handleResponse(response);

};
