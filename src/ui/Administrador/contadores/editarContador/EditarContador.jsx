import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getContadorById, updateContador } from 'services/contadorService';
import AlertMessage from 'components/Shared/Errors/AlertMessage';

// Importar los 3 formularios reutilizables
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

export const EditarContador = () => {
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
    const fetchContador = async () => {
      setAlertInfo({ type: null, message: null, details: [] });
      setLoading(true);
      try {

        const responseObject = await getContadorById(id);

        const formattedData = responseObject.data;

        if (!formattedData || !formattedData.datos || !formattedData.contacto || !formattedData.usuario) {
            console.error("Error: 'formattedData.data' no tiene la estructura esperada.");
            throw new Error("La estructura de datos recibida (response.data) no es la esperada.");
        }

        setFormData({
          datos: formattedData.datos || initialState.datos,
          contacto: formattedData.contacto || initialState.contacto,
          usuario: {
            ...initialState.usuario, // Asegura que password: ''
            username: formattedData.usuario.username || '',
            estado: formattedData.usuario.estado !== undefined 
                      ? formattedData.usuario.estado 
                      : 1,
          },
        });

      } catch (err) {
        console.error("Error al cargar contador:", err);
        setAlertInfo({
          type: 'error',
          message: 'Error al cargar el contador.',
          details: [err.message || 'No se pudieron obtener los datos.']
        });
      } finally {
        setLoading(false);
      }
    };

    fetchContador();
  }, [id]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setAlertInfo({ type: null, message: null, details: [] });

    const dataToSend = { ...formData }; 
    
    if (!dataToSend.usuario.password || dataToSend.usuario.password.trim() === '') {
      delete dataToSend.usuario.password;
    }


    try {
      const response = await updateContador(id, dataToSend); 
      setAlertInfo({
        type: 'success',
        message: response.message || 'Contador actualizado exitosamente.',
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
    return <div className="text-center p-8 text-gray-500">Cargando datos del contador...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-4">
        Editar Contador (ID: {id})
      </h2>

      <form onSubmit={handleSubmit}>
        <AlertMessage
          type={alertInfo.type}
          message={alertInfo.message}
          details={alertInfo.details}
          onClose={() => setAlertInfo({ type: null, message: null, details: [] })}
        />

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
            {saving ? 'Guardando cambios...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditarContador;