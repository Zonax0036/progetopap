import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';
import { FaBoxOpen, FaSignOutAlt, FaTachometerAlt, FaUsers, FaTicketAlt } from 'react-icons/fa';

export default function AdminLayout({ children }) {
  // Inicializa o router para acessar informações sobre a rota atual
  const router = useRouter();

  // Define os itens do menu de navegação com seus respectivos ícones
  const menu = [
    { label: 'Painel Admin', href: '/admin', icon: <FaTachometerAlt /> },
    { label: 'Produtos', href: '/admin/produtos', icon: <FaBoxOpen /> },
    { label: 'Gerenciar Usuários', href: '/admin/usuarios', icon: <FaUsers /> },
    { label: 'Cupons', href: '/admin/cupons', icon: <FaTicketAlt /> },
  ];

  // Função auxiliar para verificar se o link atual está ativo
  const isActive = path => router.pathname === path;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar fixa com altura total - ocupa toda a altura da tela */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col h-full">
        {/* Cabeçalho da sidebar */}
        <div className="p-4 text-2xl font-bold border-b border-blue-800">Admin</div>

        {/* Navegação principal - com scroll interno se necessário */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {/* Mapeia os itens do menu e cria links para cada um */}
          {menu.map(({ label, href, icon }) => (
            <Link
              href={href}
              key={href}
              className={`flex items-center px-4 py-2 rounded hover:bg-blue-700 transition ${
                isActive(href) ? 'bg-blue-700' : ''
              }`}
            >
              <span className="mr-3">{icon}</span> {label}
            </Link>
          ))}
        </nav>

        {/* Rodapé da sidebar com botão de logout */}
        <div className="px-4 py-3 border-t border-blue-800">
          <button
            onClick={() => signOut()}
            className="w-full flex items-center text-left text-red-300 hover:text-red-100 transition"
          >
            <FaSignOutAlt className="mr-2" /> Sair
          </button>
        </div>
      </aside>

      {/* Área principal de conteúdo com rolagem independente */}
      <main className="flex-1 overflow-auto p-6 bg-gray-100">{children}</main>
    </div>
  );
}
