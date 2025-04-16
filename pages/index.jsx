import { Banner } from '@/components/Banner';
import { ProductCard } from '@/components/ProductCard';

import { useRouter } from 'next/router';
import { useProdutos } from '@/lib/hooks/useProducts';

export default function Home() {
  const { produtos, loading } = useProdutos();
  const router = useRouter();
  const { categoria, pesquisa } = router.query;

  return (
    <div className="container mx-auto px-4 py-8">
      <Banner />

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {pesquisa
            ? `Resultados para "${pesquisa}"`
            : categoria
              ? `Produtos de ${categoria}`
              : 'Todos os Produtos'}
        </h1>
        {(categoria || pesquisa) && (
          <button onClick={() => router.push('/')} className="text-blue-600 hover:text-blue-800">
            ← Voltar para todos os produtos
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
        </div>
      ) : produtos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {produtos.map(produto => (
            <ProductCard key={produto.id} produto={produto} />
          ))}
        </div>
      ) : (
        <div className="bg-yellow-100 p-4 rounded text-yellow-700 text-center">
          Nenhum produto encontrado.
        </div>
      )}
    </div>
  );
}
