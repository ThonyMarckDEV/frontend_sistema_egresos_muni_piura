import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // useNavigate para redirigir
import { getEgresoById } from 'services/egresoService'; // Para mostrar info del egreso
import { createCuentaPorPagar } from 'services/cuentaPorPagarService'; // Servicio nuevo
import AlertMessage from 'components/Shared/Errors/AlertMessage';

// Estado inicial solo con la fecha
const initialState = {
  fecha_vencimiento: '',
};

export const RegistrarCuentaPorPagar = () => {
  // Obtiene el ID del egreso desde la URL
  const { id: egresoId } = useParams(); 
  const navigate = useNavigate(); // Hook para redirigir

  const [formData, setFormData] = useState(initialState);
  const [egresoInfo, setEgresoInfo] = useState(null); // Para guardar datos del egreso
  const [loadingEgreso, setLoadingEgreso] = useState(true); // Carga inicial
  const [saving, setSaving] = useState(false); // Guardado
  
  const [alertInfo, setAlertInfo] = useState({
    type: null,
    message: null,
    details: []
  });

  // Efecto para cargar datos del Egreso al inicio
  useEffect(() => {
    const fetchEgresoInfo = async () => {
      setLoadingEgreso(true);
      setAlertInfo({ type: null, message: null, details: [] });
      try {
        const response = await getEgresoById(egresoId);
        const data = response.data || response;
        if (!data || !data.proveedor) {
            throw new Error('Egreso no encontrado o no tiene proveedor asociado.');
        }
        setEgresoInfo(data);
      } catch (err) {
        console.error("Error al cargar egreso:", err);
        setAlertInfo({ 
            type: 'error', 
            message: 'Error al cargar datos del egreso asociado.', 
            details: [err.message] 
        });
      } finally {
        setLoadingEgreso(false);
      }
    };
    fetchEgresoInfo();
  }, [egresoId]);

  // Manejador simple para la fecha
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setAlertInfo({ type: null, message: null, details: [] });

    // Datos a enviar: ID del egreso y la fecha
    const dataToSend = {
      egreso_id: parseInt(egresoId, 10), // Asegura que sea número
      fecha_vencimiento: formData.fecha_vencimiento,
    };

    try {
      const response = await createCuentaPorPagar(dataToSend);
      
      setAlertInfo({
        type: 'success',
        message: response.message || 'Cuenta por pagar registrada exitosamente.',
        details: []
      });
      // Limpiar y redirigir después de 2 segundos
      setFormData(initialState);
      setTimeout(() => {
          navigate('/contador/egresos'); // O a la lista de cuentas por pagar si la creas
      }, 2000);

    } catch (err) {
      console.error("Error recibido:", err);
      let errorMessage = err.message || 'Ocurrió un error al registrar la cuenta por pagar.';
      let errorDetails = err.details || [];
      
      if (typeof errorDetails === 'object' && !Array.isArray(errorDetails)) {
        errorDetails = Object.values(errorDetails).flat();
      }
      
      setAlertInfo({
        type: 'error',
        message: errorMessage,
        details: errorDetails 
      });

    } finally {
      setSaving(false);
    }
  };

  const handleCloseAlert = () => {
    setAlertInfo({ type: null, message: null, details: [] });
  };

  // Mostrar carga inicial
  if (loadingEgreso) {
      return <div className="text-center p-8 text-gray-500">Cargando datos del egreso...</div>;
  }
  
  // Si hubo error cargando el egreso, no mostrar formulario
  if (!egresoInfo && alertInfo.type === 'error') {
       return (
            <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
                 <AlertMessage
                    type={alertInfo.type}
                    message={alertInfo.message}
                    details={alertInfo.details}
                    onClose={handleCloseAlert}
                />
            </div>
       );
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-4">
        Registrar Cuenta por Pagar
      </h2>

      {/* Mostrar info del Egreso asociado */}
      {egresoInfo && (
          <div className="mb-6 p-4 bg-gray-50 border rounded-md text-sm">
              <p><strong>Egreso ID:</strong> {egresoInfo.id}</p>
              <p><strong>Proveedor:</strong> {egresoInfo.proveedor?.nombre || 'N/A'}</p>
              <p><strong>Monto Total:</strong> S/ {parseFloat(egresoInfo.monto).toFixed(2)}</p>
          </div>
      )}

      <form onSubmit={handleSubmit}>
        
        <AlertMessage
          type={alertInfo.type}
          message={alertInfo.message}
          details={alertInfo.details}
          onClose={handleCloseAlert}
        />

        {/* --- Input de Fecha de Vencimiento --- */}
        <div className="mb-4">
          <label htmlFor="fecha_vencimiento" className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de Vencimiento *
          </label>
          <input
            id="fecha_vencimiento"
            type="date"
            name="fecha_vencimiento"
            value={formData.fecha_vencimiento}
            onChange={handleChange}
            disabled={saving || loadingEgreso || !egresoInfo} // Deshabilitado si carga o no hay egreso
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            required
            // Opcional: Poner fecha mínima hoy
            min={new Date().toISOString().split('T')[0]} 
          />
        </div>
        
        {/* --- Fin de Inputs --- */}

        <div className="mt-6">
          <button
            type="submit"
            disabled={saving || loadingEgreso || !egresoInfo}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:bg-gray-400"
          >
            {saving ? 'Guardando...' : 'Registrar Cuenta por Pagar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistrarCuentaPorPagar;