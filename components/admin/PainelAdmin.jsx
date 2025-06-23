import Link from 'next/link';
import { FaEdit, FaTrash } from 'react-icons/fa';

export function PainelAdmin({ produtos, onExcluir, loading }) {
  // Estado de carregamento - mostra um spinner quando os dados estão sendo carregados
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Estado vazio - mostra uma mensagem quando não há produtos cadastrados
  if (produtos.length === 0) {
    return (
      <div className="bg-yellow-100 p-4 rounded text-yellow-700 text-center">
        Nenhum produto encontrado. Adicione produtos para começar.
      </div>
    );
  }

  // Renderização principal - tabela de produtos
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        {/* Cabeçalho da tabela */}
        <thead className="bg-gray-50">
          <tr>
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
              Ações
            </th>
          </tr>
        </thead>
        {/* Corpo da tabela com os dados dos produtos */}
        <tbody className="bg-white divide-y divide-gray-200">
          {produtos.map(produto => (
            <tr key={produto.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">{produto.nome}</td>
              <td className="px-6 py-4 whitespace-nowrap">{produto.categoria}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {/* Formatação do preço com verificação de tipo para evitar erros */}
                €{typeof produto.preco === 'number' ? produto.preco.toFixed(2) : produto.preco}
              </td>
              <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                {/* Botão de edição que redireciona para a página de edição */}
                <Link
                  href={`/admin/editar?id=${produto.id}`}
                  className="text-blue-600 hover:text-blue-900"
                >
                  <FaEdit />
                </Link>
                {/* Botão de exclusão que chama a função onExcluir */}
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
