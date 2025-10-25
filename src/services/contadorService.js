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