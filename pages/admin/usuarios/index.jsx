import { TabelaUsuarios } from './components/TabelaUsuarios';
import { useState } from 'react';
import Link from 'next/link';
import { FaPlus } from 'react-icons/fa';
import AdminLayout from '@/components/admin/AdminLayout';

export default function PaginaUsuarios() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* A barra lateral principal será injetada pelo layout padrão do Next.js */}
      <main className="flex-1 overflow-auto p-6 bg-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gerenciamento de Usuários</h1>
          <Link
            href="/admin/usuarios/adicionar"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <FaPlus className="mr-2" /> Adicionar Usuário
          </Link>
        </div>
        <p className="text-gray-600 mb-4">
          Visualize, ative/desative ou exclua usuários do sistema
        </p>

        <TabelaUsuarios loading={loading} />
      </main>
    </div>
  );
}

// Defina o layout da página - Importante!
PaginaUsuarios.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};
