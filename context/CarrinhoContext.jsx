import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const CarrinhoContext = createContext();

const STORAGE_KEY = 'carrinho';

// Função para emitir evento de atualização do carrinho
const emitirEventoCarrinhoAtualizado = (carrinho) => {
  if (typeof window !== 'undefined') {
    const totalItens = carrinho.reduce((total, item) => total + (item.quantidade || 1), 0);
    const evento = new CustomEvent('carrinhoAtualizado', { 
      detail: { totalItens } 
    });
    window.dispatchEvent(evento);
  }
};

// Componente de notificação para feedback visual
function Notificacao({ mensagem, visivel }) {
  if (!visivel) return null;
  
  return (
    <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50">
      {mensagem}
    </div>
  );
}

export function CarrinhoProvider({ children }) {
  const [carrinho, setCarrinho] = useState([]);
  const [notificacao, setNotificacao] = useState({ visivel: false, mensagem: '' });
  const { data: session } = useSession();
  const router = useRouter();

  // Carrega o carrinho do localStorage no início
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const salvo = localStorage.getItem(STORAGE_KEY);
        if (salvo) {
          const carrinhoSalvo = JSON.parse(salvo);
          setCarrinho(carrinhoSalvo);
          // Emite evento com o carrinho carregado
          emitirEventoCarrinhoAtualizado(carrinhoSalvo);
        }
      } catch (err) {
        console.error('Erro ao carregar carrinho:', err);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Salva o carrinho no localStorage e emite evento quando mudar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        if (carrinho.length > 0) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(carrinho));
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
        
        // Emite evento sempre que o carrinho mudar
        emitirEventoCarrinhoAtualizado(carrinho);
        
      } catch (err) {
        console.error('Erro ao salvar carrinho:', err);
      }
    }
  }, [carrinho]);

  const redirecionarSeNaoLogado = useCallback(() => {
    if (!session) {
      router.push({ pathname: '/login', query: { returnUrl: router.asPath } });
      return true;
    }
    return false;
  }, [session, router]);

  const adicionarAoCarrinho = useCallback((produto) => {
    if (redirecionarSeNaoLogado()) {
      return;
    }

    setCarrinho(prevCarrinho => {
      const existente = prevCarrinho.find(item => item.id === produto.id);
      
      const novoCarrinho = existente
        ? prevCarrinho.map(item =>
            item.id === produto.id 
              ? { ...item, quantidade: item.quantidade + 1 } 
              : item
          )
        : [...prevCarrinho, { ...produto, quantidade: 1 }];
      
      // Exibe notificação
      setNotificacao({
        visivel: true,
        mensagem: `${produto.nome} adicionado ao carrinho!`
      });
      
      setTimeout(() => {
        setNotificacao({ visivel: false, mensagem: '' });
      }, 3000);
      
      return novoCarrinho;
    });
  }, [redirecionarSeNaoLogado]);

  const removerDoCarrinho = useCallback((produtoId) => {
    setCarrinho(prevCarrinho => prevCarrinho.filter(item => item.id !== produtoId));
  }, []);

  const atualizarQuantidade = useCallback((produtoId, quantidade) => {
    if (quantidade < 1) return;
    
    setCarrinho(prevCarrinho => 
      prevCarrinho.map(item => 
        item.id === produtoId ? { ...item, quantidade } : item
      )
    );
  }, []);

  const limparCarrinho = useCallback(() => {
    setCarrinho([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const calcularTotal = useCallback(() => 
    carrinho.reduce((total, item) => total + item.preco * item.quantidade, 0),
    [carrinho]
  );

  const calcularTotalItens = useCallback(() => 
    carrinho.reduce((total, item) => total + (item.quantidade || 1), 0),
    [carrinho]
  );

  const value = {
    carrinho,
    adicionarAoCarrinho,
    removerDoCarrinho,
    atualizarQuantidade,
    limparCarrinho,
    calcularTotal,
    calcularTotalItens
  };

  return (
    <CarrinhoContext.Provider value={value}>
      {children}
      <Notificacao 
        visivel={notificacao.visivel} 
        mensagem={notificacao.mensagem} 
      />
    </CarrinhoContext.Provider>
  );
}

export function useCarrinho() {
  const context = useContext(CarrinhoContext);
  
  if (!context) {
    return {
      carrinho: [],
      adicionarAoCarrinho: () => {},
      removerDoCarrinho: () => {},
      atualizarQuantidade: () => {},
      limparCarrinho: () => {},
      calcularTotal: () => 0,
      calcularTotalItens: () => 0,
    };
  }
  return context;
}
