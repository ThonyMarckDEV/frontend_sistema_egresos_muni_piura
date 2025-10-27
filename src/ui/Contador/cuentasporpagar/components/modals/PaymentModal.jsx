import React, { useState, useEffect } from 'react';
import AlertMessage from 'components/Shared/Errors/AlertMessage'; // Reusa tu componente de alerta
import { marcarCuentaComoPagada } from 'services/cuentaPorPagarService'; // Servicio para pagar

const PaymentModal = ({ isOpen, onClose, cuentaData, onPaymentSuccess }) => {
  // Estado interno del modal
  const [metodoPago, setMetodoPago] = useState('Efectivo'); // Valor inicial
  const [numeroOperacion, setNumeroOperacion] = useState('');
  const [saving, setSaving] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ type: null, message: null, details: [] });

  // Limpia el formulario cuando el modal se cierra o cambia la cuenta
  useEffect(() => {
    if (!isOpen) {
      setMetodoPago('Efectivo');
      setNumeroOperacion('');
      setAlertInfo({ type: null, message: null, details: [] });
      setSaving(false);
    }
  }, [isOpen]);

  // Handler para el cambio de método de pago
  const handleMetodoChange = (e) => {
    setMetodoPago(e.target.value);
    // Limpia el número de operación si se selecciona 'Efectivo'
    if (e.target.value === 'Efectivo') {
      setNumeroOperacion('');
    }
  };

  // Handler para el número de operación
  const handleOperacionChange = (e) => {
    setNumeroOperacion(e.target.value);
  };

  // Handler para enviar el pago
  const handlePagar = async () => {
    setSaving(true);
    setAlertInfo({ type: null, message: null, details: [] });

    const paymentData = {
      metodo_pago: metodoPago,
      // Solo envía numero_operacion si no es 'Efectivo'
      numero_operacion: metodoPago !== 'Efectivo' ? numeroOperacion : null,
    };

    try {
      const response = await marcarCuentaComoPagada(cuentaData.id, paymentData);
      setAlertInfo({
        type: 'success',
        message: response.message || 'Pago registrado exitosamente.',
        details: [],
      });
      // Llama a la función de éxito (para refrescar la lista) después de un delay
      setTimeout(() => {
        onPaymentSuccess(); // Avisa al componente padre
        onClose(); // Cierra el modal
      }, 1500); 

    } catch (err) {
      console.error("Error al pagar:", err);
      let errorDetails = err.details || [];
      if (typeof errorDetails === 'object' && !Array.isArray(errorDetails)) {
        errorDetails = Object.values(errorDetails).flat();
      }
      setAlertInfo({
        type: 'error',
        message: err.message || 'Error al registrar el pago.',
        details: errorDetails,
      });
      setSaving(false); // Permite reintentar
    } 
    // No ponemos finally(setSaving(false)) aquí para que el botón quede deshabilitado en caso de éxito
  };
  
  // No renderiza nada si no está abierto o no hay datos
  if (!isOpen || !cuentaData) {
    return null;
  }

  // Calcula montos para mostrar
  const montoTotal = parseFloat(cuentaData.egreso?.monto || 0);
  const montoPagado = parseFloat(cuentaData.monto_pagado || 0);
  const saldoPendiente = montoTotal - montoPagado;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose} // Cierra al hacer clic afuera (si no está guardando)
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 m-4"
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Registrar Pago de Cuenta
          </h3>
          <button 
            onClick={onClose}
            disabled={saving}
            className="text-gray-400 hover:text-gray-600 text-2xl disabled:opacity-50"
            aria-label="Cerrar"
          >
            &times;
          </button>
        </div>

        <div>
          {/* Alerta para errores/éxito */}
          <AlertMessage
            type={alertInfo.type}
            message={alertInfo.message}
            details={alertInfo.details}
            onClose={() => setAlertInfo({ type: null, message: null, details: [] })}
          />

          {/* Información de la cuenta */}
          <div className="mb-4 p-3 bg-gray-50 border rounded-md text-sm">
            <p><strong>Proveedor:</strong> {cuentaData.egreso?.proveedor?.nombre || 'N/A'}</p>
            <p><strong>Monto a Pagar:</strong> <span className="font-semibold text-lg">S/ {saldoPendiente.toFixed(2)}</span></p>
            <p className="text-xs text-gray-500">(Monto Total: S/ {montoTotal.toFixed(2)})</p>
          </div>

          {/* Formulario de Pago */}
          <div className="space-y-4">
            <div>
              <label htmlFor="metodo_pago" className="block text-sm font-medium text-gray-700 mb-1">
                Método de Pago *
              </label>
              <select
                id="metodo_pago"
                name="metodo_pago"
                value={metodoPago}
                onChange={handleMetodoChange}
                disabled={saving}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              >
                <option value="Efectivo">Efectivo</option>
                <option value="Deposito">Depósito Bancario</option>
                <option value="Transferencia">Transferencia Bancaria</option>
                <option value="Yape">Yape</option>
                <option value="Plin">Plin</option>
                {/* Añade más opciones si necesitas */}
              </select>
            </div>

            {/* Input para Número de Operación (condicional) */}
            {metodoPago !== 'Efectivo' && (
              <div>
                <label htmlFor="numero_operacion" className="block text-sm font-medium text-gray-700 mb-1">
                  Número de Operación / Referencia *
                </label>
                <input
                  id="numero_operacion"
                  type="text"
                  name="numero_operacion"
                  value={numeroOperacion}
                  onChange={handleOperacionChange}
                  disabled={saving}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  required 
                />
              </div>
            )}
          </div>
        </div>

        {/* Pie del Modal */}
        <div className="border-t pt-4 mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handlePagar}
            disabled={saving || (metodoPago !== 'Efectivo' && !numeroOperacion)} // Deshabilitado si falta número de op.
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-300 disabled:cursor-not-allowed"
          >
            {saving ? 'Procesando Pago...' : 'Confirmar Pago'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;