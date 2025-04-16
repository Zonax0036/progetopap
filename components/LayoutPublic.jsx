/* eslint-disable react/no-unknown-property */
// components/layouts/LayoutPublic.jsx
import { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import CategoriaMenu from './Categories';

export default function LayoutPublic({ children }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = e => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/?pesquisa=${encodeURIComponent(searchTerm.trim())}`;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white text-center py-2 text-sm font-medium">
        🎉 NOVOS PRODUTOS! Frete grátis em compras acima de €50 🎉
      </div>

      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} onSearch={handleSearch} />
      <CategoriaMenu />
      <main className="flex-grow container mx-auto px-4 py-6">{children}</main>
      <Footer />

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
