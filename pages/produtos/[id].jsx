// pages/produtos/[id].jsx
import { useCarrinho } from '@/context/CarrinhoContext';
import { ProductImage } from '@/components/ProductImage';

export default function Produto({ produto }) {
  const { adicionarAoCarrinho } = useCarrinho();

  if (!produto) {
    return <div className="text-red-500">Produto não encontrado.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">{produto.nome}</h1>

        {produto.imagem ? (
          <ProductImage
            src={produto.imagem}
            alt={produto.nome}
            className="w-full h-64 object-contain mb-4 bg-gray-100 rounded"
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
    </div>
  );
}

export async function getStaticPaths() {
  // eslint-disable-next-line no-undef
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/produtos`);
  const produtos = await res.json();

  const paths = produtos.map(produto => ({
    params: { id: String(produto.id) },
  }));

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  try {
    // eslint-disable-next-line no-undef
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/produtos/${params.id}`);
    if (!res.ok) {
      throw new Error('Produto não encontrado');
    }
    const produto = await res.json();

    return {
      props: {
        produto,
      },
      revalidate: 60, // ISR: atualiza a cada 60 segundos
    };
  } catch {
    return {
      props: {
        produto: null,
      },
    };
  }
}
