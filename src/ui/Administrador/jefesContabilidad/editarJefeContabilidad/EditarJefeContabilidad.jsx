import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// 1. Importar los servicios correctos
import { getJefeContabilidadById, updateJefeContabilidad } from 'services/jefeContabilidadService';
import AlertMessage from 'components/Shared/Errors/AlertMessage';

// Importar los 3 formularios reutilizables (se mantienen)
import DatosPersonalesFields from '../components/formularios/DatosPersonalesFields';
import DatosContactoFields from '../components/formularios/DatosContactoFields';
import DatosAccesoFields from '../components/formularios/DatosAccesoFields';

const initialState = {
  datos: {
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    sexo: 'M',
    dni: '',
  },
  contacto: {
    telefonoMovil: '',
    correo: '',
  },
  usuario: {
    username: '',
    password: '',
    estado: 1,
  },
};

// 2. Renombrar el componente
export const EditarJefeContabilidad = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [alertInfo, setAlertInfo] = useState({
    type: null,
    message: null,
    details: []
  });

  useEffect(() => {
    // 3. Renombrar la función de fetch (opcional pero recomendado)
    const fetchJefe = async () => {
      setAlertInfo({ type: null, message: null, details: [] });
      setLoading(true);
      try {
        // 4. Usar el servicio correcto
        const responseObject = await getJefeContabilidadById(id);
        const formattedData = responseObject.data;

        if (!formattedData || !formattedData.datos || !formattedData.contacto || !formattedData.usuario) {
          console.error("Error: 'formattedData.data' no tiene la estructura esperada.");
          throw new Error("La estructura de datos recibida (response.data) no es la esperada.");
        }

        setFormData({
          datos: formattedData.datos || initialState.datos,
          contacto: formattedData.contacto || initialState.contacto,
          usuario: {
            ...initialState.usuario,
            username: formattedData.usuario.username || '',
            estado: formattedData.usuario.estado !== undefined 
                      ? formattedData.usuario.estado 
                      : 1,
          },
        });

      } catch (err) {
        // 5. Actualizar mensaje de error
        console.error("Error al cargar jefe de contabilidad:", err);
        setAlertInfo({
          type: 'error',
          message: 'Error al cargar el jefe de contabilidad.',
          details: [err.message || 'No se pudieron obtener los datos.']
        });
      } finally {
        setLoading(false);
      }
    };

    fetchJefe(); // 6. Llamar a la función renombrada
  }, [id]);

  // handleChange se mantiene idéntico
  const handleChange = (e) => {
    const { name, value, dataset } = e.target;
    const { section } = dataset;

    setFormData((prevData) => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [name]: name === 'estado' ? parseInt(value, 10) : value,
      },
    }));
  };

  // handleSubmit se mantiene casi idéntico
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setAlertInfo({ type: null, message: null, details: [] });

    const dataToSend = { ...formData }; 
    
    if (!dataToSend.usuario.password || dataToSend.usuario.password.trim() === '') {
      delete dataToSend.usuario.password;
    }

    try {
      // 7. Usar el servicio de actualización correcto
      const response = await updateJefeContabilidad(id, dataToSend); 
      setAlertInfo({
        type: 'success',
        // 8. Actualizar mensaje de éxito
        message: response.message || 'Jefe de contabilidad actualizado exitosamente.',
        details: []
      });
    } catch (err) {
      console.error("Error al actualizar:", err);
      setAlertInfo({
        type: 'error',
        message: err.message,
        details: err.details || []
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    // 9. Actualizar texto de carga
    return <div className="text-center p-8 text-gray-500">Cargando datos del jefe de contabilidad...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-4">
        {/* 10. Actualizar Título */}
        Editar Jefe de Contabilidad (ID: {id})
      </h2>

      <form onSubmit={handleSubmit}>
        <AlertMessage
          type={alertInfo.type}
          message={alertInfo.message}
          details={alertInfo.details}
          onClose={() => setAlertInfo({ type: null, message: null, details: [] })}
        />

        {/* Los formularios reutilizables se mantienen idénticos */}
        <DatosPersonalesFields 
          formData={formData.datos} 
          handleChange={handleChange}
          disabled={saving} 
        />
        <DatosContactoFields 
          formData={formData.contacto} 
          handleChange={handleChange} 
          disabled={saving} 
        />
        <DatosAccesoFields 
          formData={formData.usuario} 
          handleChange={handleChange}
          isEditing={true}
          disabled={saving} 
        />

        <div className="mt-6">
          <button
            type="submit"
            disabled={saving || loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:bg-gray-400"
          >
            {/* El texto del botón es genérico y puede mantenerse */}
            {saving ? 'Guardando cambios...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
};

// 11. Actualizar el export default
export default EditarJefeContabilidad;