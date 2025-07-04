import { useState, useEffect, useCallback } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { LoadingSpinner } from '@/components/Loading';
import { useRouter } from 'next/router';

const PRODUTOS_POR_PAGINA = 9;

export function ProductGrid({ categoriaId, pesquisa }) {
  const [produtos, setProdutos] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [titulo, setTitulo] = useState('Todos os Produtos');
  const router = useRouter();

  const fetchProdutos = useCallback(
    async isNewFilter => {
      if (loading) {
        return;
      }

      setLoading(true);
      setError(null);

      const nextPage = isNewFilter ? 1 : pagina;
      const params = new URLSearchParams({
        pagina: nextPage,
        limite: PRODUTOS_POR_PAGINA,
      });

      if (categoriaId) {
        params.append('categoria', categoriaId);
      }
      if (pesquisa) {
        params.append('pesquisa', pesquisa);
      }

      try {
        const res = await fetch(`/api/produtos?${params.toString()}`);
        if (!res.ok) {
          throw new Error('Erro ao buscar produtos');
        }
        const data = await res.json();

        setProdutos(isNewFilter ? data.produtos : prev => [...prev, ...data.produtos]);
        setHasMore(
          (isNewFilter ? data.produtos.length : produtos.length + data.produtos.length) <
            data.total,
        );
        setPagina(nextPage + 1);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [loading, pagina, categoriaId, pesquisa, produtos.length],
  );

  useEffect(() => {
    fetchProdutos(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoriaId, pesquisa]);

  useEffect(() => {
    const fetchCategoryName = async () => {
      if (pesquisa) {
        setTitulo(`Resultados para "${pesquisa}"`);
      } else if (categoriaId) {
        try {
          const res = await fetch('/api/categorias');
          if (res.ok) {
            const categorias = await res.json();
            const categoriaEncontrada = categorias.find(
              cat => cat.id === parseInt(categoriaId, 10),
            );
            if (categoriaEncontrada) {
              setTitulo(`Produtos de ${categoriaEncontrada.nome}`);
            }
          }
        } catch (error) {
          console.error('Erro ao buscar nome da categoria:', error);
          setTitulo('Produtos');
        }
      } else {
        setTitulo('Todos os Produtos');
      }
    };
    fetchCategoryName();
  }, [categoriaId, pesquisa]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">{titulo}</h1>
        {(categoriaId || pesquisa) && (
          <button
            onClick={() => router.push('/')}
            className="text-blue-600 hover:text-blue-800 mt-2"
          >
            ← Voltar para todos os produtos
          </button>
        )}
      </div>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {produtos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {produtos.map(produto => (
            <ProductCard key={produto.id} produto={produto} />
          ))}
        </div>
      )}

      {loading && (
        <div className="mt-8">
          <LoadingSpinner />
        </div>
      )}

      {!loading && hasMore && (
        <div className="text-center mt-10">
          <button
            onClick={() => fetchProdutos(false)}
            disabled={loading}
            className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            Carregar Mais
          </button>
        </div>
      )}

      {!loading && !hasMore && produtos.length > 0 && (
        <p className="text-center text-gray-500 mt-10">Você chegou ao fim da lista de produtos.</p>
      )}

      {!loading && !error && produtos.length === 0 && (
        <p className="text-center text-gray-600">Nenhum produto encontrado.</p>
      )}
    </div>
  );
}
