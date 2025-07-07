import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const CarrinhoContext = createContext();

const emitirEventoCarrinhoAtualizado = carrinho => {
  if (typeof window !== 'undefined') {
    const totalItens = carrinho.reduce((total, item) => total + (item.quantidade || 1), 0);
    const evento = new CustomEvent('carrinhoAtualizado', {
      detail: { totalItens },
    });
    window.dispatchEvent(evento);
  }
};

import { toast } from 'sonner';

export function CarrinhoProvider({ children }) {
  const [carrinho, setCarrinho] = useState([]);
  const { data: session, status } = useSession();
  const router = useRouter();

  const carregarCarrinhoDoDB = useCallback(async () => {
    if (session) {
      try {
        const response = await fetch('/api/carrinho');
        if (response.ok) {
          const data = await response.json();
          setCarrinho(data);
          emitirEventoCarrinhoAtualizado(data);
        }
      } catch (error) {
        console.error('Erro ao carregar carrinho do DB:', error);
      }
    }
  }, [session]);

  useEffect(() => {
    if (status === 'authenticated') {
      carregarCarrinhoDoDB();
    } else if (status === 'unauthenticated') {
      setCarrinho([]);
      emitirEventoCarrinhoAtualizado([]);
    }
  }, [status, carregarCarrinhoDoDB]);

  useEffect(() => {
    emitirEventoCarrinhoAtualizado(carrinho);
  }, [carrinho]);

  const redirecionarSeNaoLogado = useCallback(() => {
    if (!session) {
      router.push({ pathname: '/login', query: { returnUrl: router.asPath } });
      return true;
    }
    return false;
  }, [session, router]);

  const adicionarAoCarrinho = useCallback(
    async produto => {
      if (redirecionarSeNaoLogado()) {
        return;
      }

      const existente = carrinho.find(item => item.id === produto.id);
      const novaQuantidade = existente
        ? existente.quantidade + (produto.quantidade || 1)
        : produto.quantidade || 1;

      try {
        await fetch('/api/carrinho', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ produto_id: produto.id, quantidade: novaQuantidade }),
        });
        await carregarCarrinhoDoDB();
        toast.success(`${produto.nome} adicionado ao carrinho!`);
      } catch (error) {
        console.error('Erro ao adicionar ao carrinho:', error);
        toast.error('Erro ao adicionar produto.');
      }
    },
    [carrinho, redirecionarSeNaoLogado, carregarCarrinhoDoDB],
  );

  const removerDoCarrinho = useCallback(
    async produtoId => {
      try {
        await fetch('/api/carrinho', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ produto_id: produtoId }),
        });
        await carregarCarrinhoDoDB();
        toast.success('Produto removido do carrinho.');
      } catch (error) {
        console.error('Erro ao remover do carrinho:', error);
        toast.error('Erro ao remover produto.');
      }
    },
    [carregarCarrinhoDoDB],
  );

  const atualizarQuantidade = useCallback(
    async (produtoId, quantidade) => {
      if (quantidade < 1) {
        return;
      }

      try {
        await fetch('/api/carrinho', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ produto_id: produtoId, quantidade }),
        });
        await carregarCarrinhoDoDB();
      } catch (error) {
        console.error('Erro ao atualizar quantidade:', error);
        toast.error('Erro ao atualizar quantidade.');
      }
    },
    [carregarCarrinhoDoDB],
  );

  const limparCarrinho = useCallback(async () => {
    try {
      await fetch('/api/carrinho/limpar', { method: 'POST' });
      setCarrinho([]);
      emitirEventoCarrinhoAtualizado([]);
    } catch (error) {
      console.error('Erro ao limpar carrinho:', error);
    }
  }, []);

  const calcularTotal = useCallback(
    () => carrinho.reduce((total, item) => total + item.preco * item.quantidade, 0),
    [carrinho],
  );

  const calcularTotalItens = useCallback(
    () => carrinho.reduce((total, item) => total + (item.quantidade || 1), 0),
    [carrinho],
  );

  const value = {
    carrinho,
    adicionarAoCarrinho,
    removerDoCarrinho,
    atualizarQuantidade,
    limparCarrinho,
    calcularTotal,
    calcularTotalItens,
  };

  return <CarrinhoContext.Provider value={value}>{children}</CarrinhoContext.Provider>;
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
