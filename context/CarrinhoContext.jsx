import { createContext, useState, useContext, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const CarrinhoContext = createContext();

const STORAGE_KEY = 'carrinho';

export function CarrinhoProvider({ children }) {
  const [carrinho, setCarrinho] = useState([]);
  const { data: session } = useSession();
  const router = useRouter();

  // Helpers para localStorage
  const carregarCarrinhoLocal = () => {
    try {
      const salvo = localStorage.getItem(STORAGE_KEY);
      return salvo ? JSON.parse(salvo) : [];
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return [];
    }
  };

  const salvarCarrinhoLocal = dados => {
    try {
      if (dados.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dados));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (err) {
      console.error('Erro ao salvar carrinho:', err);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCarrinho(carregarCarrinhoLocal());
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      salvarCarrinhoLocal(carrinho);
    }
  }, [carrinho]);

  const redirecionarSeNaoLogado = () => {
    if (!session) {
      router.push({ pathname: '/login', query: { returnUrl: router.asPath } });
      return true;
    }
    return false;
  };

  const adicionarAoCarrinho = produto => {
    if (redirecionarSeNaoLogado()) {
      return;
    }

    setCarrinho(prev => {
      const existente = prev.find(item => item.id === produto.id);
      return existente
        ? prev.map(item =>
            item.id === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item,
          )
        : [...prev, { ...produto, quantidade: 1 }];
    });
  };

  const removerDoCarrinho = produtoId => {
    setCarrinho(prev => prev.filter(item => item.id !== produtoId));
  };

  const atualizarQuantidade = (produtoId, quantidade) => {
    if (quantidade < 1) {
      return;
    }
    setCarrinho(prev => prev.map(item => (item.id === produtoId ? { ...item, quantidade } : item)));
  };

  const limparCarrinho = () => {
    setCarrinho([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const calcularTotal = () =>
    carrinho.reduce((total, item) => total + item.preco * item.quantidade, 0);

  return (
    <CarrinhoContext.Provider
      value={{
        carrinho,
        adicionarAoCarrinho,
        removerDoCarrinho,
        atualizarQuantidade,
        limparCarrinho,
        calcularTotal,
      }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
}

export function useCarrinho() {
  const context = useContext(CarrinhoContext);
  console.log('CarrinhoContext:', context);
  if (!context) {
    return {
      carrinho: [],
      adicionarAoCarrinho: () => {},
      removerDoCarrinho: () => {},
      atualizarQuantidade: () => {},
      limparCarrinho: () => {},
      calcularTotal: () => 0,
    };
  }
  return context;
}
