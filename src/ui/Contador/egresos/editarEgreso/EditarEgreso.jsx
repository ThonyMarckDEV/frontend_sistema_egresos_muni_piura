import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEgresoById, updateEgreso } from 'services/egresoService';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import CategoriaSelect from 'components/Shared/Comboboxes/CategorySelect'; // Ajusta ruta
import ProveedorSelect from 'components/Shared/Comboboxes/ProveedorSelect'; // Ajusta ruta

const initialState = {
  monto: '',
  categoria_id: '',
  proveedor_id: '',
  descripcion: '',
};

export const EditarEgreso = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasCuentaPorPagar, setHasCuentaPorPagar] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ type: null, message: null, details: [] });

  useEffect(() => {
    const fetchEgreso = async () => {
      setLoading(true);
      setHasCuentaPorPagar(false);
      setAlertInfo({ type: null, message: null, details: [] });
      try {
        const responseObject = await getEgresoById(id);
        const egresoData = responseObject.data || responseObject;

        if (!egresoData) {
          throw new Error("Egreso no encontrado.");
        }

        if (egresoData.cuenta_por_pagar) {
          setHasCuentaPorPagar(true);
          setAlertInfo({
            type: 'info',
            message: 'Este egreso no se puede editar porque ya tiene una cuenta por pagar asociada.',
            details: []
          });
        }

        setFormData({
          monto: egresoData.monto || '',
          categoria_id: egresoData.categoria_id ? String(egresoData.categoria_id) : '',
          proveedor_id: egresoData.proveedor_id ? String(egresoData.proveedor_id) : '',
          descripcion: egresoData.descripcion || '',
        });

      } catch (err) {
        console.error("Error al cargar egreso:", err);
        setAlertInfo({
          type: 'error',
          message: 'Error al cargar el egreso.',
          details: [err.message || 'No se pudieron obtener los datos.']
        });
      } finally {
        setLoading(false);
      }
    };
    fetchEgreso();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCategoriaChange = (e) => {
    setFormData((prevData) => ({ ...prevData, categoria_id: e.target.value }));
  };

  const handleProveedorChange = (e) => {
    setFormData((prevData) => ({ ...prevData, proveedor_id: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (hasCuentaPorPagar) return; // Doble chequeo

    setSaving(true);
    setAlertInfo({ type: null, message: null, details: [] });

    const dataToSend = {
      ...formData,
      proveedor_id: formData.proveedor_id || null,
    };

    try {
      const response = await updateEgreso(id, dataToSend);
      setAlertInfo({
        type: 'success',
        message: response.message || 'Egreso actualizado exitosamente.',
        details: []
      });
      // Opcional: Redirigir después de un tiempo
      // setTimeout(() => navigate('/contador/egresos'), 1500);

    } catch (err) {
      console.error("Error al actualizar:", err);
      let errorDetails = err.details || [];
      if (typeof errorDetails === 'object' && !Array.isArray(errorDetails)) {
        errorDetails = Object.values(errorDetails).flat();
      }
      setAlertInfo({
        type: 'error',
        message: err.message || 'Ocurrió un error al actualizar el egreso.',
        details: errorDetails
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCloseAlert = () => {
    setAlertInfo({ type: null, message: null, details: [] });
  };


  if (loading) {
    return <div className="text-center p-8 text-gray-500">Cargando datos del egreso...</div>;
  }

  // Muestra error de carga inicial y botón volver
  if (!loading && !hasCuentaPorPagar && alertInfo.type === 'info' && alertInfo.message === 'Error al cargar el egreso.') {
       return (
            <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
                 <AlertMessage
                    type={alertInfo.type}
                    message={alertInfo.message}
                    details={alertInfo.details}
                    onClose={handleCloseAlert}
                 />
                 <div className="mt-4 text-center">
                    <button
                        onClick={() => navigate('/contador/listar-egresos')}
                        className="text-sm text-blue-600 hover:underline"
                    >
                        Volver a la lista
                    </button>
                 </div>
            </div>
       );
   }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-4">
        Editar Egreso (ID: {id})
      </h2>

      <AlertMessage
        type={alertInfo.type}
        message={alertInfo.message}
        details={alertInfo.details}
        onClose={handleCloseAlert}
      />

      <form onSubmit={handleSubmit}>
        {/* Fieldset deshabilita todos los campos internos */}
        <fieldset disabled={hasCuentaPorPagar || saving || loading} className={hasCuentaPorPagar ? 'opacity-70' : ''}>
          <div className="mb-4">
            <label htmlFor="monto" className="block text-sm font-medium text-gray-700 mb-1">
              Monto *
            </label>
            <input
              id="monto" type="number" name="monto" value={formData.monto}
              onChange={handleInputChange} required step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <div className="mb-4">
            <CategoriaSelect
              value={formData.categoria_id} onChange={handleCategoriaChange} errors={{}}
              disabled={hasCuentaPorPagar || saving || loading}
            />
          </div>

          <div className="mb-4">
            <ProveedorSelect
              value={formData.proveedor_id} onChange={handleProveedorChange} errors={{}}
              disabled={hasCuentaPorPagar || saving || loading}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción (Opcional)
            </label>
            <textarea
              id="descripcion" name="descripcion" value={formData.descripcion}
              onChange={handleInputChange} rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={hasCuentaPorPagar || saving || loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {saving ? 'Guardando cambios...' : 'Guardar Cambios'}
            </button>
          </div>
        </fieldset>
      </form>

       {/* Botón Volver si está bloqueado */}
       {hasCuentaPorPagar && (
         <div className="mt-4 text-center">
            <button
                onClick={() => navigate('/contador/listar-egresos')}
                className="text-sm text-blue-600 hover:underline"
            >
                Volver a la lista de egresos
            </button>
         </div>
       )}

    </div>
  );
};

export default EditarEgreso;