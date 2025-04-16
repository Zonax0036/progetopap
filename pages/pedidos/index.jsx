// pages/meus-pedidos.jsx
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function MeusPedidos() {
  const { status } = useSession();
  const router = useRouter();

  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      const fetchPedidos = async () => {
        try {
          const res = await fetch('/api/pedidos');
          if (!res.ok) {
            throw new Error('Erro ao buscar pedidos');
          }

          const data = await res.json();
          setPedidos(data);
        } catch (err) {
          setErro(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchPedidos();
    }
  }, [status]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Meus Pedidos</h1>

      {loading && <p>Carregando pedidos...</p>}
      {erro && <p className="text-red-500">{erro}</p>}

      {!loading && pedidos.length === 0 && <p>Você ainda não fez nenhum pedido.</p>}

      {pedidos.length > 0 && (
        <ul className="space-y-4">
          {pedidos.map(pedido => (
            <li key={pedido.id} className="border rounded p-4 shadow">
              <p className="font-semibold">Pedido #{pedido.id}</p>
              <p>Data: {new Date(pedido.data).toLocaleDateString()}</p>
              <p>Total: €{pedido.total?.toFixed(2)}</p>
              {/* Adicione detalhes dos produtos se desejar */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
