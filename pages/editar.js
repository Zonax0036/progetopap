// pages/editar.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout2 from '../components/Layout2';
import axios from 'axios';

export default function EditarProduto() {
  const router = useRouter();
  const { id } = router.query;
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!router.isReady || !id) return;

    async function carregarProduto() {
      try {
        setLoading(true);
        const response = await axios.get(`/api/produtos/${id}`);
        setProduto(response.data);
      } catch (error) {
        console.error('Erro ao carregar produto:', error);
        setError('Erro ao carregar produto');
      } finally {
        setLoading(false);
      }
    }

    carregarProduto();
  }, [router.isReady, id]);

  if (loading) {
    return (
      <Layout2>
        <div>Carregando...</div>
      </Layout2>
    );
  }

  if (error) {
    return (
      <Layout2>
        <div className="text-red-500">Erro: {error}</div>
      </Layout2>
    );
  }

  return (
    <Layout2>
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Editar Produto</h1>
        {produto && (
          <div className="bg-white shadow rounded-lg p-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">ID</label>
              <p className="mt-1 text-lg">{produto.id}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome</label>
              <p className="mt-1 text-lg">{produto.nome}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Preço</label>
              <p className="mt-1 text-lg">€{produto.preco}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Categoria</label>
              <p className="mt-1 text-lg">{produto.categoria}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Descrição</label>
              <p className="mt-1 text-lg">{produto.descricao}</p>
            </div>
          </div>
        )}
      </div>
    </Layout2>
  );
}
