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

export default function RelatorioProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProdutos() {
      try {
        const res = await fetch('/api/relatorios/produtos');
        if (!res.ok) {
          throw new Error('Falha ao buscar dados');
        }
        const data = await res.json();
        setProdutos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProdutos();
  }, []);

  const chartData = {
    labels: produtos.map(p => p.nome),
    datasets: [
      {
        label: 'Total Vendido',
        data: produtos.map(p => p.total_vendido),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Receita Total (€)',
        data: produtos.map(p => p.receita_total),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Desempenho de Vendas por Produto',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  if (loading) {
    return <p>Carregando...</p>;
  }
  if (error) {
    return <p>Erro: {error}</p>;
  }

  return (
    <>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Relatório de Produtos</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Gráfico de Vendas</h2>
        <Bar data={chartData} options={chartOptions} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Dados Detalhados</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Produto</th>
              <th className="py-2 px-4 border-b">Categoria</th>
              <th className="py-2 px-4 border-b">Preço Unitário</th>
              <th className="py-2 px-4 border-b">Total Vendido</th>
              <th className="py-2 px-4 border-b">Receita Total</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map(produto => (
              <tr key={produto.id}>
                <td className="py-2 px-4 border-b flex items-center">
                  <img
                    src={produto.imagem || '/products/placeholder.jpg'}
                    alt={produto.nome}
                    className="w-10 h-10 rounded-full mr-4 object-cover"
                  />
                  {produto.nome}
                </td>
                <td className="py-2 px-4 border-b text-center">{produto.categoria}</td>
                <td className="py-2 px-4 border-b text-center">{formatCurrency(produto.preco)}</td>
                <td className="py-2 px-4 border-b text-center">{produto.total_vendido}</td>
                <td className="py-2 px-4 border-b text-center">
                  {formatCurrency(produto.receita_total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

RelatorioProdutos.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};
