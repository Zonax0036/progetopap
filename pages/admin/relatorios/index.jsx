import AdminLayout from '@/components/admin/AdminLayout';
import Link from 'next/link';
import { FaChartLine, FaUsers, FaBox } from 'react-icons/fa';

export default function RelatoriosPage() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Relatórios</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/admin/relatorios/vendas">
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center cursor-pointer hover:shadow-lg transition-shadow">
            <FaChartLine className="text-4xl text-blue-500 mr-4" />
            <div>
              <h3 className="text-xl font-semibold text-gray-700">Relatório de Vendas</h3>
              <p className="text-gray-600 mt-1">Visualize o histórico de vendas.</p>
            </div>
          </div>
        </Link>
        <Link href="/admin/relatorios/usuarios">
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center cursor-pointer hover:shadow-lg transition-shadow">
            <FaUsers className="text-4xl text-green-500 mr-4" />
            <div>
              <h3 className="text-xl font-semibold text-gray-700">Relatório de Usuários</h3>
              <p className="text-gray-600 mt-1">Veja a lista de usuários cadastrados.</p>
            </div>
          </div>
        </Link>
        <Link href="/admin/relatorios/produtos">
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center cursor-pointer hover:shadow-lg transition-shadow">
            <FaBox className="text-4xl text-purple-500 mr-4" />
            <div>
              <h3 className="text-xl font-semibold text-gray-700">Relatório de Produtos</h3>
              <p className="text-gray-600 mt-1">Analise o desempenho dos produtos.</p>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
}

RelatoriosPage.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};
