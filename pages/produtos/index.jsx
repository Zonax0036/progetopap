import { ProductCard } from '@/components/ProductCard';

export default function ProdutosPorCategoria({ categoria, produtos, erro }) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">
        {categoria ? `Categoria: ${categoria}` : 'Produtos'}
      </h1>

      {erro && <p className="text-red-500">{erro}</p>}

      {!erro && produtos.length === 0 && (
        <p className="text-gray-600">Nenhum produto encontrado para essa categoria.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* Mapeia cada produto para um componente ProductCard */}
        {produtos?.map?.(produto => (
          <ProductCard key={produto.id} produto={produto} />
        ))}
      </div>
    </div>
  );
}

// Função para buscar dados do servidor antes da renderização (Next.js SSR)
export async function getServerSideProps(context) {
  // Obtém o parâmetro "categoria" da URL
  const { categoria } = context.query;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/produtos?categoria=${encodeURIComponent(categoria || '')}`,
    );

    // Verifica se a resposta foi bem-sucedida
    if (!res.ok) {
      throw new Error('Erro ao buscar produtos');
    }

    // Converte a resposta para JSON
    const produtos = await res.json();

    // Retorna os dados como props para o componente
    return {
      props: {
        produtos,
        categoria: categoria || null,
        erro: null,
      },
    };
  } catch (err) {
    // Em caso de erro, retorna um array vazio de produtos e a mensagem de erro
    return {
      props: {
        produtos: [],
        categoria: categoria || null,
        erro: err.message || 'Erro ao carregar produtos',
      },
    };
  }
}
