import React, { useState, useEffect } from 'react';
// --- CAMBIO: Ajuste de la ruta de importación a relativa ---
import { getContadorDashboardData } from 'services/dashboardContadorService';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
// Registrar todos los componentes de Chart.js que usaremos
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);
// --- Componente de Tarjeta de KPI ---
const KpiCard = ({ title, value, icon, format = 'number' }) => {
  const formatValue = (val) => {
    if (format === 'soles') {
      return `S/ ${parseFloat(val).toFixed(2)}`;
    }
    return val;
  };
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-semibold text-gray-800">{formatValue(value)}</p>
      </div>
      {icon && (
        <div className="text-gray-300">
          {/* Aquí podrías poner un icono SVG */}
          {icon}
        </div>
      )}
    </div>
  );
};
// --- Componente Principal del Dashboard ---
export const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getContadorDashboardData();
        setDashboardData(response);
      } catch (err) {
        console.error("Error al cargar datos del dashboard:", err);
        setError(err.message || 'No se pudieron cargar los datos.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  // Datos para gráfico de Egresos Mensuales (Línea)
  // CAMBIO: Acceder a .data para desanidar
  const egresosMensualesData = {
    labels: dashboardData?.data?.egresosMensuales?.labels || [],
    datasets: [
      {
        label: 'Egresos Mensuales',
        data: dashboardData?.data?.egresosMensuales?.data || [],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };
  // Datos para gráfico de Egresos por Categoría (Dona)
  // CAMBIO: Acceder a .data y parseFloat en totals (strings -> numbers)
  const egresosPorCategoriaData = {
    labels: dashboardData?.data?.egresosPorCategoria?.map(c => c.nombre) || [],
    datasets: [
      {
        label: 'Egresos por Categoría',
        data: dashboardData?.data?.egresosPorCategoria?.map(c => parseFloat(c.total)) || [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 159, 64, 0.7)',
          'rgba(199, 199, 199, 0.7)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(199, 199, 199, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  if (loading) {
    return <div className="text-center p-8 text-gray-500">Cargando Dashboard...</div>;
  }
  if (error) {
    return <div className="p-4 bg-red-50 text-red-800 rounded-md border border-red-200">{error}</div>;
  }
  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">
        Dashboard del Contador
      </h2>
      {/* Sección de KPIs */}
      {/* CAMBIO: Acceder a .data.kpis */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiCard
          title="Egresos del Mes"
          value={dashboardData?.data?.kpis?.totalEgresosMes || 0}
          format="soles"
        />
        <KpiCard
          title="Cuentas Pendientes"
          value={dashboardData?.data?.kpis?.totalPendiente || 0}
          format="soles"
        />
        <KpiCard
          title="Proveedores Activos"
          value={dashboardData?.data?.kpis?.totalProveedores || 0}
        />
        <KpiCard
          title="Categorías Activas"
          value={dashboardData?.data?.kpis?.totalCategorias || 0}
        />
      </div>
      {/* Sección de Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Gráfico de Línea (más ancho) */}
        <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Egresos en los últimos 6 meses</h3>
          <Line
            options={{ responsive: true, plugins: { legend: { position: 'top' } } }}
            data={egresosMensualesData}
          />
        </div>
        {/* Gráfico de Dona (más angosto) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Egresos por Categoría</h3>
          <Doughnut
            data={egresosPorCategoriaData}
            options={{ responsive: true, plugins: { legend: { position: 'right' } } }}
          />
        </div>
      </div>
    </div>
  );
};
export default Dashboard;