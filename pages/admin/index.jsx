import { useRequireAdmin } from '@/lib/hooks/useRequiredAdmin';
import { FaChartBar, FaUsers, FaBoxOpen } from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import Link from 'next/link';

export default function AdminDashboard() {
  const { loading } = useRequireAdmin();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Painel de Administração</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold text-gray-700">Bem-vindo ao seu Dashboard!</h2>
        <p className="text-gray-600 mt-2">
          Aqui você pode gerenciar os principais aspectos da sua loja. Utilize o menu lateral para
          navegar entre as seções.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/admin/produtos">
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center cursor-pointer hover:shadow-lg transition-shadow">
            <FaBoxOpen className="text-4xl text-blue-500 mr-4" />
            <div>
              <h3 className="text-xl font-semibold text-gray-700">Gerenciar Produtos</h3>
              <p className="text-gray-600 mt-1">
                Adicione, edite ou remova produtos do seu catálogo.
              </p>
            </div>
          </div>
        </Link>

        <Link href="/admin/usuarios">
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center cursor-pointer hover:shadow-lg transition-shadow">
            <FaUsers className="text-4xl text-green-500 mr-4" />
            <div>
              <h3 className="text-xl font-semibold text-gray-700">Gerenciar Usuários</h3>
              <p className="text-gray-600 mt-1">Visualize e administre os usuários cadastrados.</p>
            </div>
          </div>
        </Link>

        <Link href="/admin/relatorios">
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center cursor-pointer hover:shadow-lg transition-shadow">
            <FaChartBar className="text-4xl text-purple-500 mr-4" />
            <div>
              <h3 className="text-xl font-semibold text-gray-700">Ver Relatórios</h3>
              <p className="text-gray-600 mt-1">Acesse os dados de vendas e performance da loja.</p>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
}

AdminDashboard.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};
