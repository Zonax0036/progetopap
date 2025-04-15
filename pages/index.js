// pages/index.js
import { useState, useEffect } from "react";
import axios from "axios";
import Layout2 from "../components/Layout2";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCarrinho } from "../context/CarrinhoContext";

export default function Home() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categorias, setCategorias] = useState([]);
  const router = useRouter();
  const { categoria, pesquisa } = router.query;
  const { adicionarAoCarrinho } = useCarrinho();

  useEffect(() => {
    carregarProdutos();
    carregarCategorias();
  }, [categoria, pesquisa]);

  const carregarProdutos = async () => {
    try {
      setLoading(true);
      
      // Construir URL com filtros
      let url = '/api/produtos';
      const params = new URLSearchParams();
      
      if (categoria) {
        params.append('categoria', categoria);
      }
      
      if (pesquisa) {
        params.append('pesquisa', pesquisa);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await axios.get(url);
      setProdutos(response.data);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    } finally {
      setLoading(false);
    }
  };

  const carregarCategorias = async () => {
    try {
      const response = await axios.get('/api/categorias');
      setCategorias(response.data);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    }
  };

  return (
    <Layout2>
      <div className="container mx-auto px-4 py-8">
        {/* Banner */}
        <div className="bg-blue-600 text-white rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Descubra nossa nova coleção de produtos de alto desempenho.</h2>
          <div className="flex space-x-4">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Explorar Agora
            </button>
            <button className="bg-white hover:bg-gray-100 text-blue-600 font-bold py-2 px-4 rounded">
              Ver Ofertas
            </button>
          </div>
        </div>

        {/* Título da página com filtros ativos */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {pesquisa 
              ? `Resultados para "${pesquisa}"` 
              : categoria 
                ? `Produtos de ${categoria}` 
                : "Todos os Produtos"}
          </h1>
          {(categoria || pesquisa) && (
            <button 
              onClick={() => router.push('/')}
              className="text-blue-600 hover:text-blue-800"
            >
              ← Voltar para todos os produtos
            </button>
          )}
        </div>

        {/* Lista de produtos */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : produtos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {produtos.map((produto) => (
              <div key={produto.id} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <Link href={`/produto/${produto.id}`} legacyBehavior>
                  <a>
                    <div className="h-48 bg-gray-200 overflow-hidden">
                      {produto.imagem ? (
                        <img
                          src={produto.imagem}
                          alt={produto.nome}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/150?text=Imagem+Indisponível";
                          }}
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
                  <Link href={`/produto/${produto.id}`} legacyBehavior>
                    <a className="block">
                      <h3 className="text-lg font-semibold mb-2 hover:text-blue-600">{produto.nome}</h3>
                    </a>
                  </Link>
                  <p className="text-gray-600 mb-2 line-clamp-2">{produto.descricao || "Sem descrição"}</p>
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
            ))}
          </div>
        ) : (
          <div className="bg-yellow-100 p-4 rounded text-yellow-700 text-center">
            Nenhum produto encontrado.
          </div>
        )}
      </div>
    </Layout2>
  );
}
