import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ProductCard } from '@/components/ProductCard';

export default function ProdutosPorCategoria() {
  const router = useRouter();
  const { categoria } = router.query;

  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const fetchProdutos = async () => {
      if (!categoria) {
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(`/api/produtos?categoria=${encodeURIComponent(categoria)}`);
        if (!res.ok) {
          throw new Error('Erro ao buscar produtos');
        }

        const data = await res.json();
        setProdutos(data);
        setErro('');
      } catch (err) {
        setErro(err.message || 'Erro ao carregar produtos');
        setProdutos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProdutos();
  }, [categoria]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">
        {categoria ? `Categoria: ${categoria}` : 'Produtos'}
      </h1>

      {loading && <p>Carregando produtos...</p>}
      {erro && <p className="text-red-500">{erro}</p>}

      {!loading && produtos.length === 0 && !erro && (
        <p className="text-gray-600">Nenhum produto encontrado para essa categoria.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {produtos.map(produto => (
          <ProductCard key={produto.id} produto={produto} />
        ))}
      </div>
    </div>
  );
}
