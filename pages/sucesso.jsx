import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCarrinho } from '@/context/CarrinhoContext';

export default function SucessoPage() {
  const { limparCarrinho } = useCarrinho();
  const router = useRouter();
  const { session_id } = router.query;
  const [mensagem, setMensagem] = useState('A processar a sua encomenda...');
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (session_id) {
      limparCarrinho();

      const confirmarPedido = async () => {
        try {
          const response = await fetch('/api/pedidos/confirmar', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ session_id }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'Não foi possível atualizar o seu pedido.');
          }

          setMensagem('Obrigado pela sua compra. O seu pedido foi processado com sucesso.');
        } catch (err) {
          setErro(err.message);
          setMensagem('Ocorreu um erro ao processar o seu pedido.');
        }
      };

      confirmarPedido();
    }
  }, [session_id, limparCarrinho]);

  return (
    <div className="bg-gray-50 flex flex-col justify-center items-center text-center p-4">
      <div className="bg-white p-10 rounded-lg shadow-xl max-w-md">
        <svg
          className="w-16 h-16 text-green-500 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Pagamento Concluído!</h1>
        <p className="text-gray-600 mb-6">{mensagem}</p>
        {erro && <p className="text-red-500 text-sm mb-4">{erro}</p>}
        <div className="space-y-3">
          <Link
            href="/pedidos"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Ver Meus Pedidos
          </Link>
          <Link
            href="/"
            className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-semibold transition"
          >
            Continuar Comprando
          </Link>
        </div>
      </div>
    </div>
  );
}
