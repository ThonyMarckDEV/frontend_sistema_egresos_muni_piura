import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import { getEgresoById } from 'services/egresoService'; 
import { createCuentaPorPagar } from 'services/cuentaPorPagarService'; 
import AlertMessage from 'components/Shared/Errors/AlertMessage';

const initialState = {
  fecha_vencimiento: '',
};

export const RegistrarCuentaPorPagar = () => {
  const { id: egresoId } = useParams(); 
  const navigate = useNavigate(); 

  const [formData, setFormData] = useState(initialState);
  const [egresoInfo, setEgresoInfo] = useState(null); 
  const [loadingEgreso, setLoadingEgreso] = useState(true); 
  const [saving, setSaving] = useState(false); 
  
  // --- NUEVO ESTADO ---
  // Para saber si ya tiene cuenta registrada
  const [yaTieneCuenta, setYaTieneCuenta] = useState(false); 

  const [alertInfo, setAlertInfo] = useState({
    type: null,
    message: null,
    details: []
  });

  useEffect(() => {
    const fetchEgresoInfo = async () => {
      setLoadingEgreso(true);
      setYaTieneCuenta(false); // Reinicia
      setAlertInfo({ type: null, message: null, details: [] });
      try {
        const response = await getEgresoById(egresoId);
        const data = response.data || response;
        
        // Validaciones
        if (!data) {
            throw new Error('Egreso no encontrado.');
        }
        if (!data.proveedor) {
            throw new Error('Este egreso no tiene un proveedor asociado, no se puede registrar cuenta por pagar.');
        }
        
        // --- VERIFICACIÓN CLAVE ---
        // Chequea si el backend envió 'cuenta_por_pagar' y NO es null
        if (data.cuenta_por_pagar) { 
          setYaTieneCuenta(true); // Marca que ya existe
          // Muestra un mensaje informativo, no necesariamente un error
          setAlertInfo({ 
            type: 'info', // O 'warning' si prefieres
            message: 'Este egreso ya tiene una cuenta por pagar registrada.', 
            details: [`ID Cuenta: ${data.cuenta_por_pagar.id}`] 
          });
        }
        // --- FIN VERIFICACIÓN ---
        
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // El handleSubmit no se ejecuta si el botón está deshabilitado
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Doble chequeo por si acaso
    if (yaTieneCuenta || !egresoInfo) return; 

    setSaving(true);
    setAlertInfo({ type: null, message: null, details: [] });

    const dataToSend = {
      egreso_id: parseInt(egresoId, 10), 
      fecha_vencimiento: formData.fecha_vencimiento,
    };

    try {
      const response = await createCuentaPorPagar(dataToSend);
      setAlertInfo({
        type: 'success',
        message: response.message || 'Cuenta por pagar registrada exitosamente.',
        details: []
      });
      setFormData(initialState);
      setTimeout(() => {
          navigate('/contador/egresos'); 
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

  if (loadingEgreso) {
      return <div className="text-center p-8 text-gray-500">Cargando datos del egreso...</div>;
  }
  
  // Muestra error si falló la carga inicial (como antes)
  if (!egresoInfo && !loadingEgreso && alertInfo.type === 'error') {
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

      {/* Info del Egreso (igual) */}
      {egresoInfo && (
          <div className="mb-6 p-4 bg-gray-50 border rounded-md text-sm">
              <p><strong>Egreso ID:</strong> {egresoInfo.id}</p>
              <p><strong>Proveedor:</strong> {egresoInfo.proveedor?.nombre || 'N/A'}</p>
              <p><strong>Monto Total:</strong> S/ {parseFloat(egresoInfo.monto).toFixed(2)}</p>
          </div>
      )}

      {/* Muestra SIEMPRE la alerta, incluso el 'info' si ya tiene cuenta */}
      <AlertMessage
        type={alertInfo.type}
        message={alertInfo.message}
        details={alertInfo.details}
        onClose={handleCloseAlert}
      />

      {/* --- RENDERIZADO CONDICIONAL DEL FORMULARIO --- */}
      {/* Solo muestra el formulario si NO tiene cuenta ya */}
      {!yaTieneCuenta && egresoInfo && (
        <form onSubmit={handleSubmit}>
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
              // Deshabilitado si guarda, carga o no hay egreso (esto último no debería pasar aquí)
              disabled={saving || loadingEgreso || !egresoInfo} 
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              required
              min={new Date().toISOString().split('T')[0]} 
            />
          </div>
          
          <div className="mt-6">
            <button
              type="submit"
              // Deshabilitado si guarda, carga, no hay egreso O si ya tiene cuenta
              disabled={saving || loadingEgreso || !egresoInfo || yaTieneCuenta} 
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {saving ? 'Guardando...' : 'Registrar Cuenta por Pagar'}
            </button>
          </div>
        </form>
      )}
      {/* --- FIN DEL RENDERIZADO CONDICIONAL --- */}

      {/* Botón para volver si ya tiene cuenta o hubo error */}
       {(yaTieneCuenta || (!egresoInfo && !loadingEgreso)) && (
         <div className="mt-4 text-center">
            <button 
                onClick={() => navigate('/contador/listar-cuentas-por-pagar')}
                className="text-sm text-blue-600 hover:underline"
            >
                Volver a la lista de egresos
            </button>
         </div>
       )}

    </div>
  );
};

export default RegistrarCuentaPorPagar;