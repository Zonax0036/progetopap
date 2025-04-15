import { createContext, useState, useContext, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const CarrinhoContext = createContext();

export function CarrinhoProvider({ children }) {
  const [carrinho, setCarrinho] = useState([]);
  const { data: session } = useSession();
  const router = useRouter();

  // Carregar carrinho do localStorage quando o componente montar
  useEffect(() => {
    if (typeof window !== "undefined") {
      const carrinhoSalvo = localStorage.getItem("carrinho");
      if (carrinhoSalvo) {
        try {
          setCarrinho(JSON.parse(carrinhoSalvo));
        } catch (error) {
          console.error("Erro ao carregar carrinho:", error);
          localStorage.removeItem("carrinho");
        }
      }
    }
  }, []);

  // Salvar carrinho no localStorage quando mudar
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        if (carrinho.length > 0) {
          localStorage.setItem("carrinho", JSON.stringify(carrinho));
        } else {
          localStorage.removeItem("carrinho");
        }
      } catch (error) {
        console.error("Erro ao salvar carrinho:", error);
      }
    }
  }, [carrinho]);

  // Função para adicionar um produto ao carrinho
  const adicionarAoCarrinho = (produto) => {
    // Verificar se o usuário está logado
    if (!session) {
      // Redirecionar para a página de login
      router.push({
        pathname: "/login",
        query: { returnUrl: router.asPath }
      });
      return;
    }

    setCarrinho((carrinhoAtual) => {
      // Verificar se o produto já está no carrinho
      const produtoExistente = carrinhoAtual.find(
        (item) => item.id === produto.id
      );

      if (produtoExistente) {
        // Se já existe, aumentar a quantidade
        return carrinhoAtual.map((item) =>
          item.id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      } else {
        // Se não existe, adicionar com quantidade 1
        return [...carrinhoAtual, { ...produto, quantidade: 1 }];
      }
    });
  };

  // Função para remover um produto do carrinho
  const removerDoCarrinho = (produtoId) => {
    setCarrinho((carrinhoAtual) =>
      carrinhoAtual.filter((item) => item.id !== produtoId)
    );
  };

  // Função para atualizar a quantidade de um produto
  const atualizarQuantidade = (produtoId, quantidade) => {
    if (quantidade < 1) return;

    setCarrinho((carrinhoAtual) =>
      carrinhoAtual.map((item) =>
        item.id === produtoId ? { ...item, quantidade } : item
      )
    );
  };

  // Função para limpar o carrinho
  const limparCarrinho = () => {
    setCarrinho([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem("carrinho");
    }
  };

  // Calcular o total do carrinho
  const calcularTotal = () => {
    return carrinho.reduce(
      (total, item) => total + item.preco * item.quantidade,
      0
    );
  };

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
  return useContext(CarrinhoContext);
}
