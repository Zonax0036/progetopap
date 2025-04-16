import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';
import { FaPlus, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';

export default function AdminLayout({ children }) {
  const router = useRouter();

  const menu = [
    { label: 'Painel Admin', href: '/admin', icon: <FaTachometerAlt /> },
    { label: 'Adicionar Produto', href: '/admin/adicionar', icon: <FaPlus /> },
  ];

  const isActive = path => router.pathname === path;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar fixa com altura total */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col h-full">
        <div className="p-4 text-2xl font-bold border-b border-blue-800">Admin</div>

        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
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

        <div className="px-4 py-3 border-t border-blue-800">
          <button
            onClick={() => signOut()}
            className="w-full flex items-center text-left text-red-300 hover:text-red-100 transition"
          >
            <FaSignOutAlt className="mr-2" /> Sair
          </button>
        </div>
      </aside>

      {/* Área principal com rolagem vertical */}
      <main className="flex-1 overflow-auto p-6 bg-gray-100">{children}</main>
    </div>
  );
}
