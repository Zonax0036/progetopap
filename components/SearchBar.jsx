import { FaSearch } from 'react-icons/fa';

export default function SearchBar({ searchTerm, setSearchTerm, onSearch }) {
  return (
    <form onSubmit={onSearch} className="hidden md:flex items-center flex-1 max-w-xl mx-6">
      <div className="relative w-full">
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Buscar produtos, marcas, categorias..."
          className="w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
        />
        <button type="submit" className="absolute right-3 top-3 text-gray-500 hover:text-blue-600">
          <FaSearch />
        </button>
      </div>
    </form>
  );
}
