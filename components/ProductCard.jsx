import Link from 'next/link';
import { ProductImage } from './ProductImage';
import { useCarrinho } from '@/context/CarrinhoContext';

export function ProductCard({ produto }) {
  const { adicionarAoCarrinho } = useCarrinho();

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <Link href={`/produtos/${produto.id}`} legacyBehavior>
        <a>
          <div className="h-48 bg-gray-200 overflow-hidden">
            {produto.imagem ? (
              <ProductImage
                src={produto.imagem}
                alt={produto.nome}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-gray-500">Sem imagem</span>
              </div>
            )}
          </div>
        </a>
      </Link>
      <div className="p-4">
        <Link href={`/produtos/${produto.id}`} legacyBehavior>
          <a className="block">
            <h3 className="text-lg font-semibold mb-2 hover:text-blue-600">{produto.nome}</h3>
          </a>
        </Link>
        <p className="text-gray-600 mb-2 line-clamp-2">{produto.descricao || 'Sem descrição'}</p>
        <div className="flex justify-between items-center mb-3">
          <span className="text-blue-600 font-bold">
            €{typeof produto.preco === 'number' ? produto.preco.toFixed(2) : produto.preco}
          </span>
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
            {produto.categoria}
          </span>
        </div>
        <button
          onClick={() => adicionarAoCarrinho(produto)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
        >
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  );
}
