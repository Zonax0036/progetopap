import { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import { useCarrinho } from '@/context/CarrinhoContext';
import Link from 'next/link';
import Image from 'next/image';

export default function CarrinhoPage({ user }) {
  const { 
    carrinho, 
    removerDoCarrinho, 
    atualizarQuantidade, 
    limparCarrinho, 
    calcularTotal 
  } = useCarrinho();

  const [cupom, setCupom] = useState('');
  const [cupomValido, setCupomValido] = useState(false);
  const [desconto, setDesconto] = useState(0);
  const [opcaoEntrega, setOpcaoEntrega] = useState('normal');
  const [custoEntrega, setCustoEntrega] = useState(5.99);
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });

  // Opções de entrega e seus custos
  const opcoesEntrega = {
    normal: { nome: 'Entrega Normal (3-5 dias úteis)', custo: 5.99 },
    rapida: { nome: 'Entrega Rápida (1-2 dias úteis)', custo: 9.99 },
    retirada: { nome: 'Retirar na Loja', custo: 0 }
  };

  // Atualiza o custo de entrega quando a opção mudar
  useEffect(() => {
    setCustoEntrega(opcoesEntrega[opcaoEntrega].custo);
  }, [opcaoEntrega]);

  // Calcula o total com desconto e entrega
  const calcularTotalFinal = () => {
    const subtotal = calcularTotal();
    const valorDesconto = cupomValido ? (subtotal * desconto) : 0;
    return subtotal - valorDesconto + custoEntrega;
  };

  const formatarPreco = valor =>
    valor.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' });

  // Verifica validade do cupom
  const verificarCupom = () => {
    setLoading(true);
    
    // Simulação de verificação de cupom
    setTimeout(() => {
      const cuponsValidos = {
        'DESCONTO10': 0.10,
        'DESCONTO20': 0.20,
        'PROMO50': 0.50
      };
      
      if (cuponsValidos[cupom.toUpperCase()]) {
        setCupomValido(true);
        setDesconto(cuponsValidos[cupom.toUpperCase()]);
        setMensagem({
          texto: `Cupom aplicado! ${cuponsValidos[cupom.toUpperCase()] * 100}% de desconto.`,
          tipo: 'sucesso'
        });
      } else {
        setCupomValido(false);
        setDesconto(0);
        setMensagem({
          texto: 'Cupom inválido ou expirado.',
          tipo: 'erro'
        });
      }
      setLoading(false);
      
      // Limpa a mensagem após 3 segundos
      setTimeout(() => {
        setMensagem({ texto: '', tipo: '' });
      }, 3000);
    }, 800);
  };

  // Simula o processo de finalização da compra
  const finalizarCompra = () => {
    setLoading(true);
    
    // Simulação de processamento de pagamento
    setTimeout(() => {
      setMensagem({
        texto: 'Compra finalizada com sucesso!',
        tipo: 'sucesso'
      });
      limparCarrinho();
      setLoading(false);
      
      // Limpa a mensagem após 3 segundos
      setTimeout(() => {
        setMensagem({ texto: '', tipo: '' });
      }, 3000);
    }, 1500);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Carrinho de {user?.name || 'Usuário'}
          </h1>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            ← Continuar comprando
          </Link>
        </div>

        {/* Mensagem de feedback */}
        {mensagem.texto && (
          <div className={`mb-4 p-3 rounded-md ${
            mensagem.tipo === 'sucesso' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {mensagem.texto}
          </div>
        )}

        {carrinho.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-6xl text-gray-300 flex justify-center mb-4">
              🛒
            </div>
            <h2 className="text-2xl font-semibold text-gray-600 mb-4">Seu carrinho está vazio</h2>
            <p className="text-gray-500 mb-6">
              Parece que você ainda não adicionou nenhum produto ao seu carrinho.
            </p>
            <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition">
              Ver produtos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lista de produtos */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-700">Produtos ({carrinho.length})</h2>
                  <button
                    onClick={limparCarrinho}
                    className="text-sm text-red-500 hover:text-red-700"
                  >
                    🗑️ Limpar
                  </button>
                </div>

                <ul className="divide-y divide-gray-200">
                  {carrinho.map((item, index) => (
                    <li key={index} className="p-4 hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded overflow-hidden">
                          {item.imagem ? (
                            <img
                              src={item.imagem}
                              alt={item.nome}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              Sem imagem
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="text-md font-medium text-gray-900 truncate">{item.nome}</h3>
                          <p className="text-sm text-gray-500">
                            Preço unitário: {formatarPreco(item.preco)}
                          </p>
                          {item.categoria && (
                            <p className="text-xs text-gray-400">{item.categoria}</p>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="flex border rounded-md">
                            <button 
                              className="px-3 py-1 border-r text-gray-600 hover:bg-gray-100"
                              onClick={() => atualizarQuantidade(item.id, Math.max(1, item.quantidade - 1))}
                              disabled={item.quantidade <= 1}
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min={1}
                              value={item.quantidade}
                              onChange={e => atualizarQuantidade(item.id, parseInt(e.target.value, 10) || 1)}
                              className="w-12 text-center border-none focus:outline-none focus:ring-0"
                            />
                            <button 
                              className="px-3 py-1 border-l text-gray-600 hover:bg-gray-100"
                              onClick={() => atualizarQuantidade(item.id, item.quantidade + 1)}
                            >
                              +
                            </button>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-md font-semibold text-gray-900">
                              {formatarPreco(item.preco * item.quantidade)}
                            </p>
                            <button
                              onClick={() => removerDoCarrinho(item.id)}
                              className="text-xs text-red-500 hover:text-red-700"
                            >
                              Remover
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Resumo do pedido */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Resumo do Pedido</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatarPreco(calcularTotal())}</span>
                  </div>
                  
                  {cupomValido && (
                    <div className="flex justify-between text-green-600">
                      <span>Desconto ({desconto * 100}%)</span>
                      <span>-{formatarPreco(calcularTotal() * desconto)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-gray-600">
                    <span>Entrega</span>
                    <span>{custoEntrega === 0 ? 'Grátis' : formatarPreco(custoEntrega)}</span>
                  </div>
                  
                  <div className="border-t pt-4 flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-blue-600">{formatarPreco(calcularTotalFinal())}</span>
                  </div>
                </div>
                
                {/* Opções de entrega */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-700 mb-3">Opções de Entrega</h3>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="entrega"
                        value="normal"
                        checked={opcaoEntrega === 'normal'}
                        onChange={() => setOpcaoEntrega('normal')}
                        className="text-blue-600"
                      />
                      <div className="flex-1">
                        <div className="flex items-center">
                          <span>🚚</span>
                          <span className="ml-2">{opcoesEntrega.normal.nome}</span>
                        </div>
                        <span className="text-sm text-gray-500">{formatarPreco(opcoesEntrega.normal.custo)}</span>
                      </div>
                    </label>
                    
                    <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="entrega"
                        value="rapida"
                        checked={opcaoEntrega === 'rapida'}
                        onChange={() => setOpcaoEntrega('rapida')}
                        className="text-blue-600"
                      />
                      <div className="flex-1">
                        <div className="flex items-center">
                          <span>⚡</span>
                          <span className="ml-2">{opcoesEntrega.rapida.nome}</span>
                        </div>
                        <span className="text-sm text-gray-500">{formatarPreco(opcoesEntrega.rapida.custo)}</span>
                      </div>
                    </label>
                    
                    <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="entrega"
                        value="retirada"
                        checked={opcaoEntrega === 'retirada'}
                        onChange={() => setOpcaoEntrega('retirada')}
                        className="text-blue-600"
                      />
                      <div className="flex-1">
                        <div className="flex items-center">
                          <span>🏪</span>
                          <span className="ml-2">{opcoesEntrega.retirada.nome}</span>
                        </div>
                        <span className="text-sm text-gray-500">Grátis</span>
                      </div>
                    </label>
                  </div>
                </div>
                
                {/* Cupom de desconto */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-700 mb-2">
                    🏷️ Cupom de Desconto
                  </h3>
                  <div className="flex">
                    <input
                      type="text"
                      value={cupom}
                      onChange={e => setCupom(e.target.value)}
                      placeholder="Digite seu cupom"
                      className="flex-1 border border-r-0 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={verificarCupom}
                      disabled={!cupom || loading}
                      className={`px-4 py-2 bg-blue-600 text-white rounded-r-lg ${
                        !cupom || loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                      }`}
                    >
                      {loading ? 'Verificando...' : 'Aplicar'}
                    </button>
                  </div>
                  {cupomValido && (
                    <p className="text-sm text-green-600 mt-1">Cupom aplicado: {desconto * 100}% de desconto</p>
                  )}
                </div>
                
                {/* Métodos de pagamento */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-700 mb-2">Formas de Pagamento</h3>
                  <div className="flex space-x-4 text-2xl text-gray-500">
                    <span className="cursor-pointer hover:text-blue-600" title="Cartão de Crédito">💳</span>
                    <span className="cursor-pointer hover:text-green-600" title="Transferência Bancária">💶</span>
                    <span className="cursor-pointer hover:text-yellow-600" title="Multibanco">🏧</span>
                  </div>
                </div>
                
                {/* Endereço de entrega */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-700 mb-2">Endereço de Entrega</h3>
                  <select 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue="default"
                  >
                    <option value="default" disabled>Selecione um endereço</option>
                    <option value="casa">Minha Casa</option>
                    <option value="trabalho">Meu Trabalho</option>
                    <option value="novo">+ Adicionar novo endereço</option>
                  </select>
                </div>
                
                {/* Botão de finalizar compra */}
                <button
                  onClick={finalizarCompra}
                  disabled={loading}
                  className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition ${
                    loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Processando...' : 'Finalizar Compra'}
                </button>

                <div className="mt-4 text-xs text-gray-500 text-center">
                  Ao finalizar a compra, você concorda com nossos <a href="#" className="underline">Termos de Serviço</a> e <a href="#" className="underline">Política de Privacidade</a>.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Produtos recomendados (quando o carrinho estiver vazio) */}
        {carrinho.length === 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Produtos Recomendados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-4">
                    <h3 className="font-medium">Produto Recomendado {i}</h3>
                    <p className="text-gray-500 text-sm mt-1">Descrição do produto</p>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="font-bold text-blue-600">€49.99</span>
                      <button className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm">
                        Ver Detalhes
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
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

  return {
    props: {
      user: session.user,
    },
  };
}
