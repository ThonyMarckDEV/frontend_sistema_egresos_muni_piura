import { fetchWithAuth } from 'js/authToken';
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse';

/**
 * Envía los datos de un nuevo contador al backend para su creación.
 * @param {object} contadorData - El objeto anidado con todos los datos del formulario.
 * @returns {Promise<object>} - El resultado de la operación desde el backend.
 */
export const createContador = async (contadorData) => {

  const response = await fetchWithAuth(`${API_BASE_URL}/api/contador/store`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    // Convertimos el objeto de JS a una cadena JSON
    body: JSON.stringify(contadorData)
  });

  return handleResponse(response);
};

/**
 * Obtiene una lista paginada de contadores desde el backend.
 * @param {number} page - El número de página a solicitar.
 * @returns {Promise<object>} - La respuesta paginada de Laravel.
 */
export const getContadores = async (page = 1) => {
  
  const response = await fetchWithAuth(`${API_BASE_URL}/api/contadores?page=${page}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

  // Asumimos que handleResponse parsea el JSON y maneja errores
  return handleResponse(response);
};

/**
 * Obtiene los datos de un contador específico por su ID.
 * @param {string|number} id - El ID del contador.
 */
export const getContadorById = async (id) => {

  const response = await fetchWithAuth(`${API_BASE_URL}/api/contador/${id}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  });
  return handleResponse(response);

};

/**
 * Actualiza los datos de un contador existente.
 * @param {string|number} id - El ID del contador a actualizar.
 * @param {object} contadorData - El objeto anidado con los datos a actualizar.
 */
export const updateContador = async (id, contadorData) => {

  const response = await fetchWithAuth( `${API_BASE_URL}/api/contador/${id}`, {
    method: 'PUT', // Usamos PUT como en la ruta de Laravel
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(contadorData)
  });
  return handleResponse(response);

};