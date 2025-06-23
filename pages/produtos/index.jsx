// pages/produtos/index.jsx
import { ProductCard } from '@/components/ProductCard';

// Esta é a função principal do componente que renderiza a página de produtos
export default function ProdutosPorCategoria({ categoria, produtos, erro }) {
  return (
    // Container principal com largura máxima, centralizado e com padding
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Título da página - mostra a categoria se existir, ou "Produtos" caso contrário */}
      <h1 className="text-2xl font-bold mb-4">
        {categoria ? `Categoria: ${categoria}` : 'Produtos'}
      </h1>

      {/* Exibe mensagem de erro se houver algum */}
      {erro && <p className="text-red-500">{erro}</p>}

      {/* Mensagem quando não há produtos na categoria */}
      {!erro && produtos.length === 0 && (
        <p className="text-gray-600">Nenhum produto encontrado para essa categoria.</p>
      )}

      {/* Grid responsivo para exibir os produtos
          - 1 coluna em telas pequenas
          - 2 colunas em telas médias
          - 3 colunas em telas grandes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* Mapeia cada produto para um componente ProductCard */}
        {produtos.map(produto => (
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
    // Faz uma requisição à API para buscar produtos, filtrando por categoria se fornecida
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/produtos?categoria=${encodeURIComponent(categoria || '')}`
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
