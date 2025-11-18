import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import jwtUtils from 'utilities/Token/jwtUtils';

// --- (Función Helper para Cookies - sin cambios) ---
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};
// -------------------------------------

/**
 * Botón reutilizable para generar un reporte en PDF de una tabla.
 * (Props sin cambios)
 */
const ReportButton = ({ title, columns, data, cookieUsername = 'username' }) => {
  
  const handleGeneratePdf = () => {
    // 1. Crear instancia del documento (sin cambios)
    const doc = new jsPDF();

    // 2. Obtener datos meta (sin cambios)
    const token = jwtUtils.getAccessTokenFromCookie();
    const username =  jwtUtils.getUsername(token) || 'Usuario Desconocido';
    const currentDateTime = new Date().toLocaleString('es-PE');

    // 3. Añadir Título (sin cambios)
    doc.setFontSize(16);
    doc.text(title, 14, 22);

    // 4. Añadir Metadatos (sin cambios)
    doc.setFontSize(10);
    doc.text(`Generado por: ${username}`, 14, 30);
    doc.text(`Fecha y Hora: ${currentDateTime}`, 14, 36);

    // 5. Añadir la tabla
    // <-- CAMBIO 2: Llamar a autoTable(doc, { ... }) en lugar de doc.autoTable({ ... })
    autoTable(doc, {
      columns: columns,
      body: data,
      startY: 45, 
      theme: 'striped', 
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [38, 50, 56], 
        textColor: 255,
        fontStyle: 'bold',
      },
    });

    // 6. Guardar el PDF (sin cambios)
    const fileName = `${title.replace(/ /g, '_')}_${Date.now()}.pdf`;
    doc.save(fileName);
  };

  return (
    <button
      onClick={handleGeneratePdf}
      disabled={!data || data.length === 0}
      className="inline-flex items-center px-4 py-2 border border-transparent 
                 text-sm font-medium rounded-md shadow-sm text-white 
                 bg-green-600 hover:bg-green-700 
                 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
                 disabled:opacity-50 disabled:cursor-not-allowed"
      title="Generar Reporte PDF"
    >
      {/* Icono SVG (sin cambios) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 mr-2"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 10a1 1 0 10-2 0v3a1 1 0 102 0v-3z"
          clipRule="evenodd"
        />
        <path d="M9 2a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V3a1 1 0 00-1-1H9z" />
      </svg>
      Generar Reporte
    </button>
  );
};

export default ReportButton;