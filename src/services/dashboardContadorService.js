import { fetchWithAuth } from 'js/authToken'; // Asumiendo que este es tu helper de auth
import API_BASE_URL from 'js/urlHelper'; // Asumiendo que esta es tu URL base
import { handleResponse } from 'utilities/Responses/handleResponse'; // Asumiendo que este es tu helper de respuesta

/**
 * Obtiene todos los datos para el dashboard del contador.
 */
export const getContadorDashboardData = async () => {
  
  const response = await fetchWithAuth(`${API_BASE_URL}/api/dashboard-data-contador`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  });
  
  return handleResponse(response);
};