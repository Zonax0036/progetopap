import { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import { useCarrinho } from '@/context/CarrinhoContext';
import Link from 'next/link';
import Image from 'next/image';

// Componente para o modal de adicionar endereço
function EnderecoModal({ onClose, onEnderecoAdicionado }) {
  const [novoEndereco, setNovoEndereco] = useState({
    nome_morada: '',
    rua: '',
    numero: '',
    complemento: '',
    conselho: '',
    distrito: '',
    codigo_postal: '',
  });
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const handleChange = e => {
    setNovoEndereco({ ...novoEndereco, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setErro('');
    try {
      const res = await fetch('/api/moradas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoEndereco),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Falha ao adicionar endereço');
      }
      onEnderecoAdicionado(data);
      onClose();
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Adicionar Novo Endereço</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="nome_morada"
            onChange={handleChange}
            placeholder="Nome (ex: Casa, Trabalho)"
            className="w-full p-2 border rounded"
            required
          />
          <input
            name="rua"
            onChange={handleChange}
            placeholder="Rua"
            className="w-full p-2 border rounded"
            required
          />
          <div className="flex space-x-2">
            <input
              name="numero"
              onChange={handleChange}
              placeholder="Número"
              className="w-1/3 p-2 border rounded"
              required
            />
            <input
              name="complemento"
              onChange={handleChange}
              placeholder="Complemento"
              className="w-2/3 p-2 border rounded"
            />
          </div>
          <div className="flex space-x-2">
            <input
              name="conselho"
              onChange={handleChange}
              placeholder="Conselho"
              className="w-1/2 p-2 border rounded"
              required
            />
            <input
              name="distrito"
              onChange={handleChange}
              placeholder="Distrito"
              className="w-1/4 p-2 border rounded"
              required
            />
            <input
              name="codigo_postal"
              onChange={handleChange}
              placeholder="Codigo Postal"
              className="w-1/4 p-2 border rounded"
              required
            />
          </div>
          {erro && <p className="text-red-500 text-sm">{erro}</p>}
          <div className="flex justify-end space-x-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
            >
              {loading ? 'Salvando...' : 'Salvar Endereço'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CarrinhoPage({ user }) {
  const { carrinho, removerDoCarrinho, atualizarQuantidade, limparCarrinho, calcularTotal } =
    useCarrinho();

  // Estados gerais
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });

  // Estados do Cupom
  const [cupomInput, setCupomInput] = useState('');
  const [cupomAplicado, setCupomAplicado] = useState(null);

  // Estados da Entrega
  const [opcaoEntrega, setOpcaoEntrega] = useState('normal');
  const [custoEntrega, setCustoEntrega] = useState(5.99);
  const opcoesEntrega = {
    normal: { nome: 'Entrega Normal (3-5 dias úteis)', custo: 5.99 },
    rapida: { nome: 'Entrega Rápida (1-2 dias úteis)', custo: 9.99 },
    retirada: { nome: 'Retirar na Loja', custo: 0 },
  };

  // Estados do Endereço
  const [moradas, setEnderecos] = useState([]);
  const [enderecoSelecionadoId, setEnderecoSelecionadoId] = useState('');
  const [modalEnderecoAberto, setModalEnderecoAberto] = useState(false);

  // Estado do Pagamento
  const [metodoPagamento, setMetodoPagamento] = useState('');

  // Efeitos
  useEffect(() => {
    setCustoEntrega(opcoesEntrega[opcaoEntrega].custo);
  }, [opcaoEntrega]);

  useEffect(() => {
    const fetchEnderecos = async () => {
      try {
        const res = await fetch('/api/moradas');
        if (!res.ok) {
          throw new Error('Falha ao buscar moradas');
        }
        const data = await res.json();
        setEnderecos(data);
        // Seleciona o primeiro endereço como padrão
        if (data.length > 0) {
          setEnderecoSelecionadoId(data[0].id);
        }
      } catch (error) {
        console.error(error);
        setMensagem({ texto: 'Não foi possível carregar seus moradas.', tipo: 'erro' });
      }
    };
    fetchEnderecos();
  }, []);

  // Funções de cálculo
  const subtotal = calcularTotal();
  const valorDesconto = cupomAplicado
    ? cupomAplicado.tipo === 'percentual'
      ? subtotal * (cupomAplicado.valor / 100)
      : cupomAplicado.valor
    : 0;
  const totalFinal = subtotal - valorDesconto + custoEntrega;

  const formatarPreco = valor =>
    valor.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' });

  // Funções de ação
  const verificarCupom = async () => {
    if (!cupomInput) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/cupons/${cupomInput}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Cupom inválido');
      }
      setCupomAplicado(data);
      setMensagem({ texto: `Cupom "${data.codigo}" aplicado com sucesso!`, tipo: 'sucesso' });
    } catch (err) {
      setCupomAplicado(null);
      setMensagem({ texto: err.message, tipo: 'erro' });
    } finally {
      setLoading(false);
    }
  };

  const finalizarCompra = async () => {
    if (carrinho.length === 0) {
      setMensagem({ texto: 'Seu carrinho está vazio.', tipo: 'erro' });
      return;
    }
    if (!enderecoSelecionadoId) {
      setMensagem({ texto: 'Por favor, selecione um endereço de entrega.', tipo: 'erro' });
      return;
    }
    if (!metodoPagamento) {
      setMensagem({ texto: 'Por favor, selecione uma forma de pagamento.', tipo: 'erro' });
      return;
    }

    setLoading(true);
    setMensagem({ texto: '', tipo: '' });

    const dadosPedido = {
      carrinho,
      enderecoId: enderecoSelecionadoId,
      cupom: cupomAplicado,
      subtotal,
      valorDesconto,
      valorEntrega: custoEntrega,
      total: totalFinal,
      metodoPagamento,
    };

    try {
      const response = await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosPedido),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao finalizar a compra');
      }

      setMensagem({ texto: 'Compra finalizada com sucesso! Redirecionando...', tipo: 'sucesso' });
      limparCarrinho();
      setTimeout(() => {
        window.location.href = '/pedidos'; // Redireciona para a página de pedidos
      }, 2000);
    } catch (error) {
      setMensagem({ texto: error.message, tipo: 'erro' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {modalEnderecoAberto && (
        <EnderecoModal
          onClose={() => setModalEnderecoAberto(false)}
          onEnderecoAdicionado={novo => {
            setEnderecos([...moradas, novo]);
            setEnderecoSelecionadoId(novo.id);
          }}
        />
      )}
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

          {mensagem.texto && (
            <div
              className={`mb-4 p-3 rounded-md ${mensagem.tipo === 'sucesso' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
            >
              {mensagem.texto}
            </div>
          )}

          {carrinho.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <h2 className="text-2xl font-semibold text-gray-600 mb-4">Seu carrinho está vazio</h2>
              <Link
                href="/"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                Ver produtos
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-700">
                      Produtos ({carrinho.length})
                    </h2>
                    <button
                      onClick={limparCarrinho}
                      className="text-sm text-red-500 hover:text-red-700"
                    >
                      🗑️ Limpar
                    </button>
                  </div>
                  <ul className="divide-y divide-gray-200">
                    {carrinho.map(item => (
                      <li key={item.id} className="p-4 flex items-center space-x-4">
                        <Image
                          src={item.imagem || '/products/placeholder.jpg'}
                          alt={item.nome}
                          width={80}
                          height={80}
                          className="rounded object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium">{item.nome}</h3>
                          <p className="text-sm text-gray-500">{formatarPreco(item.preco)}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => atualizarQuantidade(item.id, item.quantidade - 1)}
                            disabled={item.quantidade <= 1}
                          >
                            -
                          </button>
                          <span>{item.quantidade}</span>
                          <button onClick={() => atualizarQuantidade(item.id, item.quantidade + 1)}>
                            +
                          </button>
                        </div>
                        <p className="font-semibold">
                          {formatarPreco(item.preco * item.quantidade)}
                        </p>
                        <button
                          onClick={() => removerDoCarrinho(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remover
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-4 space-y-6">
                  <h2 className="text-xl font-semibold text-gray-700">Resumo do Pedido</h2>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span> <span>{formatarPreco(subtotal)}</span>
                    </div>
                    {cupomAplicado && (
                      <div className="flex justify-between text-green-600">
                        <span>Desconto</span> <span>-{formatarPreco(valorDesconto)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Entrega</span> <span>{formatarPreco(custoEntrega)}</span>
                    </div>
                    <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
                      <span>Total</span>{' '}
                      <span className="text-blue-600">{formatarPreco(totalFinal)}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Opções de Entrega</h3>
                    <select
                      value={opcaoEntrega}
                      onChange={e => setOpcaoEntrega(e.target.value)}
                      className="w-full p-2 border rounded"
                    >
                      {Object.entries(opcoesEntrega).map(([key, { nome, custo }]) => (
                        <option key={key} value={key}>
                          {nome} - {formatarPreco(custo)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Endereço de Entrega</h3>
                    <select
                      value={enderecoSelecionadoId}
                      onChange={e => setEnderecoSelecionadoId(e.target.value)}
                      className="w-full p-2 border rounded"
                    >
                      <option value="" disabled>
                        Selecione um endereço
                      </option>
                      {moradas.map(end => (
                        <option key={end.id} value={end.id}>
                          {end.nome_morada}: {end.rua}, {end.numero}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => setModalEnderecoAberto(true)}
                      className="text-sm text-blue-600 hover:underline mt-1"
                    >
                      + Adicionar novo endereço
                    </button>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">🏷️ Cupom de Desconto</h3>
                    <div className="flex">
                      <input
                        type="text"
                        value={cupomInput}
                        onChange={e => setCupomInput(e.target.value)}
                        placeholder="Digite seu cupom"
                        className="flex-1 p-2 border rounded-l-lg"
                      />
                      <button
                        onClick={verificarCupom}
                        disabled={loading}
                        className="px-4 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 disabled:bg-blue-300"
                      >
                        {loading ? '...' : 'Aplicar'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Forma de Pagamento</h3>
                    <select
                      value={metodoPagamento}
                      onChange={e => setMetodoPagamento(e.target.value)}
                      className="w-full p-2 border rounded"
                    >
                      <option value="" disabled>
                        Selecione o pagamento
                      </option>
                      <option value="Cartão de Crédito">💳 Cartão de Crédito</option>
                      <option value="Transferência Bancária">💶 Transferência Bancária</option>
                      <option value="Multibanco">🏧 Multibanco</option>
                    </select>
                  </div>

                  <button
                    onClick={finalizarCompra}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition disabled:bg-blue-300"
                  >
                    {loading ? 'Processando...' : `Finalizar Compra (${formatarPreco(totalFinal)})`}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: `/login?returnUrl=${encodeURIComponent('/carrinho')}`,
        permanent: false,
      },
    };
  }
  return { props: { user: session.user } };
}
