import { fetchWithAuth } from 'js/authToken';
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse';

/**
 * Envía los datos de un nuevo Jefe de Contabilidad al backend.
 * @param {object} jefeData - El objeto anidado con todos los datos del formulario.
 */
export const createJefeContabilidad = async (jefeData) => {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/jefe-contabilidad/store`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(jefeData)
  });
  return handleResponse(response);
};

/**
 * Obtiene una lista paginada de Jefes de Contabilidad.
 * @param {number} page - El número de página a solicitar.
 */
export const getJefesContabilidad = async (page = 1) => {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/jefes-contabilidad?page=${page}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
  return handleResponse(response);
};

/**
 * Obtiene los datos de un Jefe de Contabilidad específico por su ID.
 * @param {string|number} id - El ID del jefe.
 */
export const getJefeContabilidadById = async (id) => {

  const response = await fetchWithAuth(`${API_BASE_URL}/api/jefe-contabilidad/${id}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  });
  return handleResponse(response);

};

/**
 * Actualiza los datos de un Jefe de Contabilidad existente.
 * @param {string|number} id - El ID del jefe a actualizar.
 * @param {object} jefeData - El objeto anidado con los datos a actualizar.
 */
export const updateJefeContabilidad = async (id, jefeData) => {

  const response = await fetchWithAuth(`${API_BASE_URL}/api/jefe-contabilidad/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(jefeData)
  });
  return handleResponse(response);

};