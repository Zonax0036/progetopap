// pages/produto/[id].js
import { useRouter } from 'next/router';
import Layout2 from '../../components/Layout2';
import { useEffect, useState } from 'react';

export default function Produto() {
  const router = useRouter();
  const { id } = router.query;
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/produtos/${id}`);
        if (!res.ok) {
          throw new Error(`Erro ao carregar produto: ${res.status}`);
        }
        const data = await res.json();
        setProduto(data);
      } catch (e) {
        setError(e.message);
        setProduto(null);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchProduct();
    }
  }, [id]);

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
        {produto && (
          <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-4">{produto.nome}</h1>
            <img src={produto.imagem} alt={produto.nome} className="w-full h-64 object-cover mb-4" />
            <p className="text-gray-700">{produto.descricao}</p>
            <p className="text-blue-500 font-bold">Preço: €{produto.preco}</p>
            <p>Categoria: {produto.categoria}</p>
          </div>
        )}
      </div>
    </Layout2>
  );
}
