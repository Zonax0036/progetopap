import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Layout2 from "../components/Layout2";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FaEdit, FaTrash, FaPlus, FaEye } from "react-icons/fa";

export default function AdminPanel() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);

  const carregarProdutos = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/produtos');
      setProdutos(response.data);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Verificar se o usuário é admin
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && session.user?.email !== "admin@email.com") {
      router.push("/");
    } else if (status === "authenticated") {
      carregarProdutos();
    }
  }, [session, status, router, carregarProdutos]);

  const excluirProduto = async (id) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        console.log("Tentando excluir produto ID:", id);
        const response = await axios.delete(`/api/produtos/${id}`);
        console.log("Resposta da exclusão:", response.data);
        
        alert("Produto excluído com sucesso!");
        carregarProdutos(); // Recarregar a lista
      } catch (error) {
        console.error("Erro ao excluir produto:", error);
        if (error.response) {
          console.error("Status:", error.response.status);
          console.error("Dados:", error.response.data);
        }
        alert(`Erro ao excluir o produto: ${error.message}`);
      }
    }
  };

  if (loading) {
    return (
      <Layout2>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout2>
    );
  }

  return (
    <Layout2>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Painel de Administração</h1>
          <Link href="/adicionar" legacyBehavior>
            <a className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center">
              <FaPlus className="mr-2" /> Adicionar Novo Produto
            </a>
          </Link>
        </div>

        {produtos.length > 0 ? (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preço
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {produtos.map((produto) => (
                  <tr key={produto.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          {produto.imagem ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={produto.imagem}
                              alt={produto.nome}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://images.unsplash.com/photo-1560769629-975ec94e6a86?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80";
                              }}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-xs text-gray-500">Sem img</span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{produto.nome}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{produto.descricao}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {produto.categoria}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      €{typeof produto.preco === 'number' ? produto.preco.toFixed(2) : produto.preco}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                      <Link href={`/editar?id=${produto.id}`} legacyBehavior>
                          <a className="text-gray-600 hover:text-gray-900 p-2 bg-gray-100 rounded">
                            <FaEye />
                          </a>
                        </Link>
                        <Link href={`/editar?id=${produto.id}`} legacyBehavior>
                          <a className="text-blue-600 hover:text-blue-900 p-2 bg-blue-100 rounded">
                            <FaEdit />
                          </a>
                        </Link>
                        <button
                          onClick={() => excluirProduto(produto.id)}
                          className="text-red-600 hover:text-red-900 p-2 bg-red-100 rounded"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-yellow-100 p-4 rounded text-yellow-700 text-center">
            Nenhum produto encontrado. Adicione produtos para começar.
          </div>
        )}
      </div>
    </Layout2>
  );
}
