import Link from 'next/link';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { formatCurrency } from '@/lib/utils/currency';

export function TabelaProdutos({ produtos, onExcluir, loading }) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (produtos.length === 0) {
    return (
      <div className="bg-yellow-100 p-4 rounded text-yellow-700 text-center">
        Nenhum produto encontrado. Adicione produtos para começar.
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Imagem
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Produto
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Categoria
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Preço
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Data de Criação
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {produtos.map(produto => (
            <tr key={produto.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <img
                  src={produto.imagem || '/products/placeholder.jpg'}
                  alt={produto.nome}
                  className="h-12 w-12 object-cover rounded"
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = '/products/placeholder.jpg';
                  }}
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{produto.nome}</td>
              <td className="px-6 py-4 whitespace-nowrap">{produto.categoria}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {formatCurrency(Number(produto.preco))}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {new Date(produto.data_criacao).toLocaleDateString('pt-BR')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                <Link
                  href={`/admin/produtos/editar?id=${produto.id}`}
                  className="text-blue-600 hover:text-blue-900"
                >
                  <FaEdit />
                </Link>
                <button
                  onClick={() => onExcluir(produto.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
