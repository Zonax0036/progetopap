import Link from 'next/link';
import { FaUser, FaSignOutAlt, FaAngleDown } from 'react-icons/fa';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

export default function NavUserMenu({ session }) {
  const [menuAberto, setMenuAberto] = useState(false);

  if (!session) {
    return (
      <Link href="/login" legacyBehavior>
        <a className="flex items-center px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white">
          <FaUser className="text-sm md:mr-2" />
          <span className="hidden md:inline">Entrar</span>
        </a>
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        className="flex items-center p-2 text-gray-700 hover:text-blue-600"
        onClick={() => setMenuAberto(!menuAberto)}
      >
        <FaUser className="text-lg md:mr-1" />
        <span className="hidden md:inline text-sm">{session.user.name || 'Conta'}</span>
        <FaAngleDown className="ml-1 text-xs" />
      </button>

      {menuAberto && (
        <div
          className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50"
          onMouseLeave={() => setMenuAberto(false)}
        >
          <Link href="/perfil" legacyBehavior>
            <a className="block px-4 py-2 hover:bg-blue-50">Meu Perfil</a>
          </Link>
          <Link href="/pedidos" legacyBehavior>
            <a className="block px-4 py-2 hover:bg-blue-50">Meus Pedidos</a>
          </Link>

          <hr className="my-1" />
          <button
            onClick={() => signOut()}
            className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center"
          >
            <FaSignOutAlt className="mr-2" /> Sair
          </button>
        </div>
      )}
    </div>
  );
}
