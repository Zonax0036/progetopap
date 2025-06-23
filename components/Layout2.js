// components/Layout2.js
import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from "next-auth/react";
import { FaShoppingCart, FaUser, FaPlus, FaSignOutAlt, FaSearch, FaAngleDown, FaHome, FaHeart, FaInfoCircle, FaCog } from "react-icons/fa";
import { useCarrinho } from "../context/CarrinhoContext";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

const Layout2 = ({ children }) => {
  // Hooks para gerenciar estado e funcionalidades
  const { data: session, status } = useSession();  // Autenticação
  const { carrinho } = useCarrinho();             // Carrinho de compras
  const router = useRouter();                     // Roteamento
  const [searchTerm, setSearchTerm] = useState(""); // Termo de busca
  const [isScrolled, setIsScrolled] = useState(false); // Estado de rolagem
  const [menuAberto, setMenuAberto] = useState(false); // Estado do menu dropdown

  // Efeito para detectar rolagem e alterar estilo do cabeçalho
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Função para lidar com a busca de produtos
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/?pesquisa=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  // Estrutura do componente
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* ... Resto do código com múltiplas seções */}
    </div>
  );
}

export default Layout2;
