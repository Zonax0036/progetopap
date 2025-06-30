import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';
import { useCarrinho } from '@/context/CarrinhoContext';
import SearchBar from './SearchBar';
import NavUserMenu from './NavUserMenu';
import { useSession } from 'next-auth/react';

export default function Header({ searchTerm, setSearchTerm, onSearch }) {
  // Obtém informações da sessão do usuário usando next-auth
  const { data: session } = useSession();

  // Obtém o distrito do carrinho
  const { carrinho, calcularTotalItens } = useCarrinho();

  // Estado local para o contador
  const [itemCount, setItemCount] = useState(0);

  // Inicializa o contador com base no carrinho atual
  useEffect(() => {
    setItemCount(calcularTotalItens());
  }, [carrinho, calcularTotalItens]);

  // Configura um listener para o evento personalizado
  useEffect(() => {
    const handleCarrinhoAtualizado = event => {
      console.log('Evento de carrinho atualizado recebido:', event.detail.totalItens);
      setItemCount(event.detail.totalItens);
    };

    // Adiciona o listener
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

        {/* Componente de barra de pesquisa */}
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} onSearch={onSearch} />

        {/* Navegação principal com links para favoritos, carrinho e menu do usuário */}
        <nav className="flex items-center space-x-4">
          {/* Link para página de favoritos (oculto em telas pequenas) */}
          <Link href="/favoritos" legacyBehavior>
            <a className="hidden md:flex items-center hover:text-blue-600 text-gray-700">
              <FaHeart className="text-lg" />
              <span className="hidden md:inline ml-1 text-sm">Favoritos</span>
            </a>
          </Link>

          {/* Link para o carrinho com contador de itens */}
          <Link href="/carrinho" legacyBehavior>
            <a className="relative flex items-center hover:text-blue-600 text-gray-700">
              <FaShoppingCart className="text-lg" />
              <span className="hidden md:inline ml-1 text-sm">Carrinho</span>
              {/* Badge com contador de itens no carrinho */}
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

          {/* Componente de menu do usuário */}
          <NavUserMenu session={session} />
        </nav>
      </div>
    </header>
  );
}
