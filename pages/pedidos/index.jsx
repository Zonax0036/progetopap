import { useState } from 'react';
import { getSession } from 'next-auth/react';

import { formatCurrency } from '../../lib/utils/currency';

export default function MeusPedidos({ pedidos }) {
  const [openOrderId, setOpenOrderId] = useState(null);

  const toggleOrder = id => {
    setOpenOrderId(openOrderId === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Meus Pedidos</h1>

      {pedidos.length === 0 && <p>Você ainda não fez nenhum pedido.</p>}

      {pedidos.length > 0 && (
        <div className="space-y-4">
          {pedidos.map(pedido => (
            <div key={pedido.id} className="border rounded shadow-md">
              <div
                className="flex justify-between items-center p-4 cursor-pointer"
                onClick={() => toggleOrder(pedido.id)}
              >
                <h2 className="text-lg font-bold">Pedido #{pedido.id}</h2>
                <span
                  className={`px-2 py-1 text-sm font-semibold rounded-full ${
                    pedido.status === 'Entregue' || pedido.status === 'Pago'
                      ? 'bg-green-100 text-green-800'
                      : pedido.status === 'Cancelado'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {pedido.status}
                </span>
              </div>
              {openOrderId === pedido.id && (
                <div className="p-4 border-t space-y-4">
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
                </div>
              )}
            </div>
          ))}
        </div>
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
