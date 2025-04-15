// components/Layout2.js
import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from "next-auth/react";
import { FaShoppingCart, FaUser, FaPlus, FaSignOutAlt, FaSearch, FaAngleDown, FaHome, FaHeart, FaInfoCircle, FaCog } from "react-icons/fa";
import { useCarrinho } from "../context/CarrinhoContext";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

const Layout2 = ({ children }) => {
  const { data: session, status } = useSession();
  const { carrinho } = useCarrinho();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);

  // Detectar scroll para mudar o estilo do header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/?pesquisa=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Anúncio superior */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white text-center py-2 text-sm font-medium">
        🎉 NOVOS PRODUTOS! Frete grátis em compras acima de €50 🎉
      </div>

      {/* Header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white shadow-md py-2" : "bg-white py-4"}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" legacyBehavior>
              <a className="flex items-center">
                <div className="bg-blue-600 text-white p-2 rounded-lg mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <span className="text-2xl font-bold text-gray-800">SportShop</span>
              </a>
            </Link>

            {/* Barra de pesquisa */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-xl mx-6">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar produtos, marcas, categorias..."
                  className="w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                />
                <button type="submit" className="absolute right-3 top-3 text-gray-500 hover:text-blue-600">
                  <FaSearch />
                </button>
              </div>
            </form>

            {/* Menu de navegação */}
            <nav className="flex items-center space-x-1 md:space-x-4">
              <Link href="/favoritos" legacyBehavior>
                <a className="hidden md:flex items-center p-2 hover:text-blue-600 text-gray-700">
                  <FaHeart className="text-lg md:mr-1" />
                  <span className="hidden md:inline text-sm">Favoritos</span>
                </a>
              </Link>

              <Link href="/carrinho" legacyBehavior>
                <a className="flex items-center p-2 hover:text-blue-600 text-gray-700 relative">
                  <FaShoppingCart className="text-lg md:mr-1" />
                  <span className="hidden md:inline text-sm">Carrinho</span>
                  {carrinho.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {carrinho.length}
                    </span>
                  )}
                </a>
              </Link>

              {/* Menu do usuário com dropdown - Versão com estado React */}
              {session ? (
                <div className="relative">
                  <button 
                    className="flex items-center p-2 text-gray-700 hover:text-blue-600"
                    onClick={() => setMenuAberto(!menuAberto)}
                  >
                    <FaUser className="text-lg md:mr-1" />
                    <span className="hidden md:inline text-sm">{session.user.name || "Conta"}</span>
                    <FaAngleDown className="ml-1 text-xs" />
                  </button>
                  
                  {menuAberto && (
                    <div 
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50"
                      onMouseLeave={() => setMenuAberto(false)}
                    >
                      <Link href="/perfil" legacyBehavior>
                        <a className="block px-4 py-2 text-gray-700 hover:bg-blue-50">Meu Perfil</a>
                      </Link>
                      <Link href="/pedidos" legacyBehavior>
                        <a className="block px-4 py-2 text-gray-700 hover:bg-blue-50">Meus Pedidos</a>
                      </Link>
                      
                      {/* Links de Administração */}
                      {session.user.email === "admin@email.com" && (
                        <>
                          <hr className="my-1" />
                          <Link href="/admin" legacyBehavior>
                            <a className="block px-4 py-2 text-gray-700 hover:bg-blue-50 flex items-center">
                              <FaCog className="mr-2" /> Painel Admin
                            </a>
                          </Link>
                          <Link href="/adicionar" legacyBehavior>
                            <a className="block px-4 py-2 text-gray-700 hover:bg-blue-50 flex items-center">
                              <FaPlus className="mr-2" /> Adicionar Produto
                            </a>
                          </Link>
                        </>
                      )}
                      
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
              ) : (
                <Link href="/login" legacyBehavior>
                  <a className="flex items-center px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200">
                    <FaUser className="text-sm md:mr-2" />
                    <span className="hidden md:inline">Entrar</span>
                  </a>
                </Link>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Categorias */}
      <div className="bg-gray-100 shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex justify-between overflow-x-auto py-3 scrollbar-hide">
            <Link href="/" legacyBehavior>
              <a className={`category-btn ${!router.query.categoria ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'}`}>
                Todos
              </a>
            </Link>
            <Link href="/?categoria=futebol" legacyBehavior>
              <a className={`category-btn ${router.query.categoria === 'futebol' ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'}`}>
                Futebol
              </a>
            </Link>
            <Link href="/?categoria=basquetebol" legacyBehavior>
              <a className={`category-btn ${router.query.categoria === 'basquetebol' ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'}`}>
                Basquetebol
              </a>
            </Link>
            <Link href="/?categoria=musculacao" legacyBehavior>
              <a className={`category-btn ${router.query.categoria === 'musculacao' ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'}`}>
                Musculação
              </a>
            </Link>
            <Link href="/?categoria=judo" legacyBehavior>
              <a className={`category-btn ${router.query.categoria === 'judo' ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'}`}>
                Judo
              </a>
            </Link>
            <Link href="/?categoria=corrida" legacyBehavior>
              <a className={`category-btn ${router.query.categoria === 'corrida' ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'}`}>
                Corrida
              </a>
            </Link>
            <Link href="/?categoria=natacao" legacyBehavior>
              <a className={`category-btn ${router.query.categoria === 'natacao' ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'}`}>
                Natação
              </a>
            </Link>
            <Link href="/?categoria=acessorios" legacyBehavior>
              <a className={`category-btn ${router.query.categoria === 'acessorios' ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'}`}>
                Acessórios
              </a>
            </Link>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">SportShop</h3>
              <p className="text-gray-300 mb-4">
                Sua loja online para todos os equipamentos esportivos de alta qualidade.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Produtos</h3>
              <ul className="space-y-2">
                <li><Link href="/?categoria=futebol" legacyBehavior><a className="text-gray-300 hover:text-white">Futebol</a></Link></li>
                <li><Link href="/?categoria=basquetebol" legacyBehavior><a className="text-gray-300 hover:text-white">Basquetebol</a></Link></li>
                <li><Link href="/?categoria=musculacao" legacyBehavior><a className="text-gray-300 hover:text-white">Musculação</a></Link></li>
                <li><Link href="/?categoria=judo" legacyBehavior><a className="text-gray-300 hover:text-white">Judo</a></Link></li>
                <li><Link href="/?categoria=corrida" legacyBehavior><a className="text-gray-300 hover:text-white">Corrida</a></Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Links Úteis</h3>
              <ul className="space-y-2">
                <li><Link href="/sobre" legacyBehavior><a className="text-gray-300 hover:text-white">Sobre Nós</a></Link></li>
                <li><Link href="/entrega" legacyBehavior><a className="text-gray-300 hover:text-white">Entrega</a></Link></li>
                <li><Link href="/devolucoes" legacyBehavior><a className="text-gray-300 hover:text-white">Devoluções</a></Link></li>
                <li><Link href="/termos" legacyBehavior><a className="text-gray-300 hover:text-white">Termos e Condições</a></Link></li>
                <li><Link href="/privacidade" legacyBehavior><a className="text-gray-300 hover:text-white">Política de Privacidade</a></Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contato</h3>
              <p className="text-gray-300 mb-2">Email: info@sportshop.com</p>
              <p className="text-gray-300 mb-2">Telefone: (123) 456-7890</p>
              <p className="text-gray-300 mb-4">Endereço: Rua do Esporte, 123, Lisboa</p>
              <div className="mt-4">
                <h4 className="text-sm font-semibold mb-2">Inscreva-se para novidades</h4>
                <form className="flex">
                  <input
                    type="email"
                    placeholder="Seu email"
                    className="px-3 py-2 rounded-l-lg w-full focus:outline-none text-gray-800"
                  />
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg">
                    Enviar
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} SportShop. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Estilos globais */}
      <style jsx global>{`
        .category-btn {
          display: inline-block;
          white-space: nowrap;
          padding: 0.5rem 1.25rem;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          transition: all 0.2s;
          background-color: #f3f4f6;
          color: #374151;
          text-decoration: none;
        }
        .category-btn:hover {
          background-color: #e5e7eb;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

export default Layout2;
