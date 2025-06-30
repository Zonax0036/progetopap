import AdminLayout from '@/components/admin/AdminLayout';
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { formatCurrency } from '@/lib/utils/currency';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function RelatorioUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUsuarios() {
      try {
        const res = await fetch('/api/relatorios/usuarios');
        if (!res.ok) {
          throw new Error('Falha ao buscar dados');
        }
        const data = await res.json();
        setUsuarios(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchUsuarios();
  }, []);

  const topClientesData = {
    labels: usuarios.slice(0, 10).map(u => u.nome),
    datasets: [
      {
        label: 'Total Gasto (€)',
        data: usuarios.slice(0, 10).map(u => u.total_gasto),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  if (loading) {
    return <p>Carregando...</p>;
  }
  if (error) {
    return <p>Erro: {error}</p>;
  }

  return (
    <>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Relatório de Usuários</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          Top 10 Clientes por Valor Gasto
        </h2>
        <Bar data={topClientesData} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Todos os Usuários</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Nome</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Tipo</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Data de Cadastro</th>
              <th className="py-2 px-4 border-b">Último Login</th>
              <th className="py-2 px-4 border-b">Pedidos</th>
              <th className="py-2 px-4 border-b">Total Gasto</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(usuario => (
              <tr key={usuario.id}>
                <td className="py-2 px-4 border-b">{usuario.nome}</td>
                <td className="py-2 px-4 border-b">{usuario.email}</td>
                <td className="py-2 px-4 border-b">{usuario.role}</td>
                <td className="py-2 px-4 border-b">{usuario.ativo ? 'Ativo' : 'Inativo'}</td>
                <td className="py-2 px-4 border-b">
                  {new Date(usuario.data_criacao).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 border-b">
                  {usuario.ultimo_login ? new Date(usuario.ultimo_login).toLocaleString() : 'Nunca'}
                </td>
                <td className="py-2 px-4 border-b text-center">{usuario.total_pedidos}</td>
                <td className="py-2 px-4 border-b text-center">
                  {formatCurrency(usuario.total_gasto)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

RelatorioUsuarios.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};
