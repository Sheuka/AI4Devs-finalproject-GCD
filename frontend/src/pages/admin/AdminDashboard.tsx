import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import adminService from '../../services/adminService';
import { toast } from 'react-toastify';
import { Navigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell,
  LineChart, Line,
  ResponsiveContainer
} from 'recharts';

interface KPI {
  label: string;
  value: number;
  color: string;
}

interface MonthlyData {
  month: string;
  newClients: number;
  newProfessionals: number;
}

interface ProjectDistribution {
  name: string;
  value: number;
}

interface ActivityTrend {
  date: string;
  registrations: number;
  projectsCreated: number;
}

const AdminDashboard: React.FC = () => {
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [projectDistribution, setProjectDistribution] = useState<ProjectDistribution[]>([]);
  const [activityTrend, setActivityTrend] = useState<ActivityTrend[]>([]);
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(true); // Suponiendo que se valida el rol

  useEffect(() => {
    const fetchData = async () => {
      try {
        const kpiData = await adminService.getKpis();
        setKpis(kpiData);

        const monthly = await adminService.getMonthlyData();
        setMonthlyData(monthly);

        const distribution = await adminService.getProjectDistribution();
        setProjectDistribution(distribution);

        const trend = await adminService.getActivityTrend();
        setActivityTrend(trend);

        const projects = await adminService.getRecentProjects();
        setRecentProjects(projects);
      } catch (error: any) {
        toast.error(error.message || 'Error al cargar los datos del dashboard.');
      }
    };

    fetchData();
  }, []);

  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="flex">
      <Sidebar />
      
      <div className="flex-1 min-h-screen flex flex-col">
        <Navbar />

        <main className="p-6 bg-gray-100 flex-1">
          <h1 className="text-3xl font-bold mb-6">Dashboard de Administración</h1>

          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {kpis.map((kpi) => (
              <div key={kpi.label} className={`p-4 rounded-lg shadow ${kpi.color}`}>
                <h2 className="text-xl font-semibold">{kpi.label}</h2>
                <p className="text-2xl">{kpi.value}</p>
              </div>
            ))}
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Gráfico de Barras */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Comparación Mensual de Nuevos Clientes y Profesionales</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="newClients" fill="#8884d8" name="Nuevos Clientes" />
                  <Bar dataKey="newProfessionals" fill="#82ca9d" name="Nuevos Profesionales" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Gráfico Circular */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Distribución de Proyectos por Estado</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={projectDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {projectDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Gráfico de Líneas */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Tendencia de Actividad en la Plataforma</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={activityTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="registrations" stroke="#8884d8" name="Nuevos Registros" />
                  <Line type="monotone" dataKey="projectsCreated" stroke="#82ca9d" name="Proyectos Creados" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tabla Resumida */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Proyectos más Recientes</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Título
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Profesional Asignado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha de Creación
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentProjects.map((project) => (
                    <tr key={project.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{project.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{project.clientName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {project.professionalName || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {project.status}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-4">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p>© 2024 ChapuExpress. Todos los derechos reservados.</p>
            <div className="mt-2">
              <a href="/terms" className="mx-2 hover:underline">Términos y Condiciones</a>
              |
              <a href="/support" className="mx-2 hover:underline">Soporte</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminDashboard; 