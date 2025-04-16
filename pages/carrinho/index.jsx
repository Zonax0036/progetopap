import { useCarrinho } from '@/context/CarrinhoContext';
import Link from 'next/link';

export default function CarrinhoPage() {
  const { carrinho, removerDoCarrinho, atualizarQuantidade, limparCarrinho, calcularTotal } =
    useCarrinho();

  const formatarPreco = valor =>
    valor.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' });

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Seu Carrinho</h1>

      {carrinho.length === 0 ? (
        <div className="text-gray-600">
          Seu carrinho está vazio.{' '}
          <Link href="/" className="text-blue-600 hover:underline">
            Voltar à loja
          </Link>
        </div>
      ) : (
        <>
          <ul className="space-y-4">
            {carrinho.map((item, index) => (
              <li
                key={index}
                className="flex flex-col sm:flex-row items-center justify-between border-b pb-4 gap-4"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  {item.imagem && (
                    <img
                      src={item.imagem}
                      alt={item.nome}
                      className="w-20 h-20 object-cover rounded"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold">{item.nome}</h3>
                    <p className="text-sm text-gray-500">
                      Preço unitário: {formatarPreco(item.preco)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Total: {formatarPreco(item.preco * item.quantidade)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    value={item.quantidade}
                    onChange={e => atualizarQuantidade(item.id, parseInt(e.target.value, 10))}
                    className="w-16 text-center border rounded"
                  />
                  <button
                    onClick={() => removerDoCarrinho(item.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remover
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 text-right">
            <p className="text-xl font-bold">
              Total do Carrinho:{' '}
              <span className="text-blue-600">{formatarPreco(calcularTotal())}</span>
            </p>
          </div>

          <div className="mt-6 flex justify-between flex-col sm:flex-row gap-2">
            <button
              onClick={limparCarrinho}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
            >
              Limpar Carrinho
            </button>
            <button
              onClick={() => alert('Simulação de checkout')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Finalizar Compra
            </button>
          </div>
        </>
      )}
    </div>
  );
}
