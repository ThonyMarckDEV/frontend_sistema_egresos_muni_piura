import { fetchWithAuth } from 'js/authToken';
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse';

/**
 * Registra una nueva cuenta por pagar vinculada a un egreso.
 * @param {object} cuentaData - Objeto con { egreso_id, fecha_vencimiento }
 */
export const createCuentaPorPagar = async (cuentaData) => {
  // Ruta: /api/cuenta-por-pagar
  const response = await fetchWithAuth(`${API_BASE_URL}/api/cuenta-por-pagar/store`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(cuentaData)
  });
  return handleResponse(response);
};

export const getCuentasPorPagar = async (page = 1) => {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/cuentas-por-pagar?page=${page}`, {
    method: 'GET', headers: { 'Accept': 'application/json' }
  });
  return handleResponse(response);
};

export const getCuentaPorPagarById = async (id) => {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/cuenta-por-pagar/${id}`, {
    method: 'GET', headers: { 'Accept': 'application/json' }
  });
  return handleResponse(response);
};
