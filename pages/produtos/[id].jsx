// pages/produtos/[id].jsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { useCarrinho } from '@/context/CarrinhoContext';
import { useFavoritos } from '@/context/FavoritosContext';
import { ProductImage } from '@/components/ProductImage';
import LayoutPublic from '@/components/LayoutPublic';
import { LoadingSpinner } from '@/components/Loading';
import { formatCurrency } from '@/lib/utils/currency';

export default function Produto({ produto }) {
  const { data: session } = useSession();
  const { adicionarAoCarrinho } = useCarrinho();
  const { favoritos, adicionarAosFavoritos, removerDosFavoritos } = useFavoritos();
  const [quantidade, setQuantidade] = useState(1);
  const [favoritosMessage, setFavoritosMessage] = useState('');
  const router = useRouter();

  const isInFavoritos = produto && favoritos.some(item => item.id === produto.id);

  if (router.isFallback) {
    return (
      <LayoutPublic>
        <LoadingSpinner />
      </LayoutPublic>
    );
  }

  if (!produto) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold text-gray-800">Produto não encontrado</h1>
        <p className="text-gray-600 mt-2">
          O produto que você está procurando não existe ou foi removido.
        </p>
      </div>
    );
  }

  const handleAdicionarAoCarrinho = () => {
    adicionarAoCarrinho({ ...produto, quantidade });
  };

  const handleFavoritosToggle = () => {
    if (!session) {
      router.push('/login');
      return;
    }

    if (isInFavoritos) {
      removerDosFavoritos(produto.id);
      setFavoritosMessage('Removido dos favoritos!');
    } else {
      adicionarAosFavoritos(produto);
      setFavoritosMessage('Adicionado aos favoritos!');
    }
    setTimeout(() => setFavoritosMessage(''), 3000);
  };

  return (
    <>
      <Head>
        <title>{produto.nome} - A Loja</title>
        <meta name="description" content={produto.descricao} />
      </Head>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            <ProductImage
              src={produto.imagem}
              alt={produto.nome}
              className="w-full h-96 object-cover"
            />
          </div>

          <div className="md:w-1/2 p-8 flex flex-col justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-2">{produto.categoria}</p>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{produto.nome}</h1>
              <p className="text-gray-700 mb-6">{produto.descricao}</p>
            </div>

            <div>
              <p className="text-3xl font-bold text-blue-600 mb-6">
                {formatCurrency(produto.preco)}
              </p>

              <div className="flex items-center mb-6">
                <label htmlFor="quantidade" className="mr-4 font-semibold text-gray-700">
                  Quantidade:
                </label>
                <input
                  type="number"
                  id="quantidade"
                  name="quantidade"
                  min="1"
                  value={quantidade}
                  onChange={e => setQuantidade(Math.max(1, parseInt(e.target.value, 10)))}
                  className="w-20 p-2 border border-gray-300 rounded-md text-center"
                />
              </div>

              <button
                onClick={handleAdicionarAoCarrinho}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105"
              >
                Adicionar ao Carrinho
              </button>

              <button
                onClick={handleFavoritosToggle}
                className={`w-full mt-4 font-bold py-3 px-6 rounded-lg transition-colors ${
                  isInFavoritos
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
              >
                {isInFavoritos ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
              </button>
              {favoritosMessage && (
                <p className="text-center mt-2 text-sm text-green-600">{favoritosMessage}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getStaticPaths() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/produtos`);
  const { produtos } = await res.json();

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
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/produtos/${params.id}`);
    if (!res.ok) {
      throw new Error('Produto não encontrado');
    }
    const produto = await res.json();

    return {
      props: {
        produto,
      },
      revalidate: 60,
    };
  } catch {
    return {
      props: {
        produto: null,
      },
    };
  }
}
