// pages/meus-pedidos.jsx
import { getSession } from 'next-auth/react';

export default function MeusPedidos({ pedidos }) {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Meus Pedidos</h1>

      {pedidos.length === 0 && <p>Você ainda não fez nenhum pedido.</p>}

      {pedidos.length > 0 && (
        <ul className="space-y-4">
          {pedidos.map(pedido => (
            <li key={pedido.id} className="border rounded p-4 shadow">
              <p className="font-semibold">Pedido #{pedido.id}</p>
              <p>Data: {new Date(pedido.data).toLocaleDateString()}</p>
              <p>Total: €{pedido.total?.toFixed(2)}</p>
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
