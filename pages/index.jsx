import { Banner } from '@/components/Banner';
import { ProductCard } from '@/components/ProductCard';
import { useRouter } from 'next/router';

export default function Home({ produtos, categoria, pesquisa }) {
  const router = useRouter();

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

      {produtos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {produtos?.map?.(produto => (
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

export async function getServerSideProps(context) {
  const { categoria: categoriaId, pesquisa } = context.query;

  // eslint-disable-next-line no-undef
  const queryParams = new URLSearchParams();
  if (categoriaId) {
    queryParams.append('categoria', categoriaId);
  }
  if (pesquisa) {
    queryParams.append('pesquisa', pesquisa);
  }

  // Fetch produtos
  const resProdutos = await fetch(
    // eslint-disable-next-line no-undef
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/produtos?${queryParams.toString()}`,
  );
  const dataProdutos = await resProdutos.json();

  let categoriaNome = null;
  if (categoriaId) {
    try {
      // Fetch all categories to find the name
      const resCategorias = await fetch(
        // eslint-disable-next-line no-undef
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/categorias`,
      );
      if (resCategorias.ok) {
        const categorias = await resCategorias.json();
        const categoriaEncontrada = categorias.find(cat => cat.id === parseInt(categoriaId, 10));
        if (categoriaEncontrada) {
          categoriaNome = categoriaEncontrada.nome;
        }
      }
    } catch (error) {
      console.error('Erro ao buscar nome da categoria:', error);
    }
  }

  return {
    props: {
      produtos: dataProdutos.produtos || [],
      categoria: categoriaNome,
      pesquisa: pesquisa || null,
    },
  };
}
