import { getSession } from 'next-auth/react';

import { formatCurrency } from '../../lib/utils/currency';

export default function MeusPedidos({ pedidos }) {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Meus Pedidos</h1>

      {pedidos.length === 0 && <p>Você ainda não fez nenhum pedido.</p>}

      {pedidos.length > 0 && (
        <ul className="space-y-4">
          {pedidos.map(pedido => (
            <li key={pedido.id} className="border rounded p-4 shadow-md space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold">Pedido #{pedido.id}</h2>
                <span
                  className={`px-2 py-1 text-sm font-semibold rounded-full ${
                    pedido.status === 'Entregue'
                      ? 'bg-green-100 text-green-800'
                      : pedido.status === 'Cancelado'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {pedido.status}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Data: {new Date(pedido.data_criacao).toLocaleDateString()}
              </p>

              <div>
                <h3 className="font-semibold mb-2">Itens do Pedido:</h3>
                <ul className="space-y-2">
                  {pedido.itens.map(item => (
                    <li
                      key={item.produto_id}
                      className="flex justify-between items-center p-2 bg-gray-50 rounded"
                    >
                      <div>
                        <p className="font-medium">{item.nome_produto}</p>
                        <p className="text-sm text-gray-500">
                          {item.quantidade} x €{formatCurrency(item.preco_unitario)}
                        </p>
                      </div>
                      <p className="font-semibold">
                        €{formatCurrency(item.quantidade * item.preco_unitario)}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-right font-bold text-lg">
                <p>Total do Pedido: €{formatCurrency(pedido.total)}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/pedidos`, {
      headers: {
        Cookie: context.req.headers.cookie || '',
      },
    });

    if (!res.ok) {
      throw new Error('Erro ao buscar pedidos');
    }

    const pedidos = await res.json();

    return {
      props: {
        pedidos,
      },
    };
  } catch (error) {
    console.error('Erro ao carregar pedidos:', error);
    return {
      props: {
        pedidos: [],
      },
    };
  }
}
