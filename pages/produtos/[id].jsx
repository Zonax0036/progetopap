// pages/produtos/[id].js
import { useRouter } from 'next/router';

import { useEffect, useState } from 'react';
import { useCarrinho } from '@/context/CarrinhoContext';
import { ProductImage } from '@/components/ProductImage';

export default function Produto() {
  const router = useRouter();
  const { id } = router.query;
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { adicionarAoCarrinho } = useCarrinho();

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/produtos/${id}`);
        if (!res.ok) {
          throw new Error(`Erro ao carregar produto: ${res.status}`);
        }
        const data = await res.json();
        setProduto(data);
      } catch (e) {
        setError(e.message);
        setProduto(null);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div className="text-red-500">Erro: {error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {produto && (
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-4">{produto.nome}</h1>

          {produto.imagem ? (
            <ProductImage
              src={produto.imagem}
              alt={produto.nome}
              className="w-full h-64 object-cover mb-4"
            />
          ) : (
            <div className="w-full h-64 flex items-center justify-center bg-gray-100 mb-4">
              <span className="text-gray-500">Sem imagem</span>
            </div>
          )}

          <p className="text-gray-700 mb-2">{produto.descricao}</p>
          <p className="text-blue-600 font-bold text-lg mb-2">Preço: €{produto.preco}</p>
          <p className="mb-4 text-sm text-gray-500">Categoria: {produto.categoria}</p>

          <button
            onClick={() => adicionarAoCarrinho(produto)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            Adicionar ao Carrinho
          </button>
        </div>
      )}
    </div>
  );
}
