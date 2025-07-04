import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';
import { useCarrinho } from '@/context/CarrinhoContext';
import { useFavoritos } from '@/context/FavoritosContext';
import SearchBar from './SearchBar';
import NavUserMenu from './NavUserMenu';
import { useSession } from 'next-auth/react';

export default function Header({ searchTerm, setSearchTerm, onSearch }) {
  const { data: session } = useSession();

  const { carrinho, calcularTotalItens } = useCarrinho();

  const { favoritos } = useFavoritos();
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    setItemCount(calcularTotalItens());
  }, [carrinho, calcularTotalItens]);

  useEffect(() => {
    const handleCarrinhoAtualizado = event => {
      setItemCount(event.detail.totalItens);
    };

    window.addEventListener('carrinhoAtualizado', handleCarrinhoAtualizado);

    // Remove o listener quando o componente é desmontado
    return () => {
      window.removeEventListener('carrinhoAtualizado', handleCarrinhoAtualizado);
    };
  }, []);

  return (
    <header className="bg-white py-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo e nome da loja com link para a página inicial */}
        <Link href="/" legacyBehavior>
          <a className="flex items-center">
            <div className="bg-blue-600 text-white p-2 rounded-lg mr-2">🛒</div>
            <span className="text-2xl font-bold text-gray-800">SportShop</span>
          </a>
        </Link>

        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} onSearch={onSearch} />

        <nav className="flex items-center space-x-4">
          {session && (
            <>
              <Link href="/favoritos" legacyBehavior>
                <a className="relative md:flex items-center pr-5 hover:text-blue-600 text-gray-700">
                  <FaHeart className="text-lg" />
                  <span className="hidden md:inline ml-1 text-sm">Favoritos</span>
                  {favoritos.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {favoritos.length}
                    </span>
                  )}
                </a>
              </Link>

              <Link href="/carrinho" legacyBehavior>
                <a className="relative flex items-center  pr-5 hover:text-blue-600 text-gray-700">
                  <FaShoppingCart className="text-lg" />
                  <span className="hidden md:inline ml-1 text-sm">Carrinho</span>

                  {itemCount > 0 && (
                    <span
                      key={itemCount}
                      className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
                    >
                      {itemCount}
                    </span>
                  )}
                </a>
              </Link>
            </>
          )}

          {/* Componente de menu do usuário */}
          <NavUserMenu session={session} />
        </nav>
      </div>
    </header>
  );
}
