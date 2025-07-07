import Link from 'next/link';
import { FaUser, FaSignOutAlt, FaAngleDown } from 'react-icons/fa';
import { signOut } from 'next-auth/react';
import { useState, useRef, useEffect } from 'react';
import { useCarrinho } from '@/context/CarrinhoContext';

export default function NavUserMenu({ session }) {
  const [menuAberto, setMenuAberto] = useState(false);
  const menuRef = useRef(null);
  useCarrinho();

  const handleLogout = () => {
    signOut();
  };

  // Fecha o menu quando clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuAberto(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef]);

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
    <div className="relative" ref={menuRef}>
      <button
        className="flex items-center p-2 text-gray-700 hover:text-blue-600"
        onClick={() => setMenuAberto(!menuAberto)}
      >
        <FaUser className="text-lg md:mr-1" />
        <span className="hidden md:inline text-sm">{session.user.name || 'Conta'}</span>
        <FaAngleDown className="ml-1 text-xs" />
      </button>

      {menuAberto && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50">
          <Link href="/perfil" legacyBehavior>
            <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">Meu Perfil</a>
          </Link>
          <Link href="/pedidos" legacyBehavior>
            <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">Meus Pedidos</a>
          </Link>
          <Link href="/favoritos" legacyBehavior>
            <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">Favoritos</a>
          </Link>

          <hr className="my-1" />
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center"
          >
            <FaSignOutAlt className="mr-2" /> Sair
          </button>
        </div>
      )}
    </div>
  );
}
