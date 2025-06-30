import AdminLayout from '@/components/admin/AdminLayout';
import { useEffect, useState } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { formatCurrency } from '@/lib/utils/currency';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

export default function RelatorioVendas() {
  const [vendas, setVendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchVendas() {
      try {
        const res = await fetch('/api/relatorios/vendas');
        if (!res.ok) {
          throw new Error('Falha ao buscar dados');
        }
        const data = await res.json();
        setVendas(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchVendas();
  }, []);

  const faturamentoData = {
    labels: vendas.map(v => new Date(v.dia).toLocaleDateString()),
    datasets: [
      {
        label: 'Faturamento Total (€)',
        data: vendas.map(v => v.faturamento_total),
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  const statusData = {
    labels: ['Pagos', 'Pendentes', 'Enviados', 'Cancelados'],
    datasets: [
      {
        data: [
          vendas.reduce((acc, v) => acc + v.pedidos_pagos, 0),
          vendas.reduce((acc, v) => acc + v.pedidos_pendentes, 0),
          vendas.reduce((acc, v) => acc + v.pedidos_enviados, 0),
          vendas.reduce((acc, v) => acc + v.pedidos_cancelados, 0),
        ],
        backgroundColor: ['#4CAF50', '#FFC107', '#2196F3', '#F44336'],
        hoverBackgroundColor: ['#66BB6A', '#FFCA28', '#42A5F5', '#EF5350'],
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
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Relatório de Vendas</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Faturamento por Dia</h2>
          <Line data={faturamentoData} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Distribuição por Status</h2>
          <Pie data={statusData} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Dados Detalhados por Dia</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Data</th>
              <th className="py-2 px-4 border-b">Total de Pedidos</th>
              <th className="py-2 px-4 border-b">Faturamento Total</th>
              <th className="py-2 px-4 border-b">Ticket Médio</th>
            </tr>
          </thead>
          <tbody>
            {vendas.map(venda => (
              <tr key={venda.dia}>
                <td className="py-2 px-4 border-b text-center">
                  {new Date(venda.dia).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 border-b text-center">{venda.total_pedidos}</td>
                <td className="py-2 px-4 border-b text-center">
                  {formatCurrency(venda.faturamento_total)}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {formatCurrency(venda.ticket_medio)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

RelatorioVendas.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};
