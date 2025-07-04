import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

const FavoritosContext = createContext();

export function FavoritosProvider({ children }) {
  const [favoritos, setFavoritos] = useState([]);
  const { data: session, status } = useSession();

  const fetchFavoritos = useCallback(async () => {
    if (status === 'authenticated') {
      try {
        const response = await fetch(`/api/favoritos/${session.user.id}`);
        if (response.ok) {
          const data = await response.json();
          setFavoritos(data);
        }
      } catch (error) {
        console.error('Erro ao buscar favoritos:', error);
      }
    }
  }, [session, status]);

  useEffect(() => {
    fetchFavoritos();
  }, [fetchFavoritos]);

  const adicionarAosFavoritos = async produto => {
    if (status !== 'authenticated') {
      return;
    }
    try {
      const response = await fetch('/api/favoritos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ produto_id: produto.id }),
      });
      if (response.ok) {
        setFavoritos(prev => [...prev, produto]);
      }
    } catch (error) {
      console.error('Erro ao adicionar aos favoritos:', error);
    }
  };

  const removerDosFavoritos = async produtoId => {
    if (status !== 'authenticated') {
      return;
    }
    try {
      const response = await fetch('/api/favoritos', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ produto_id: produtoId }),
      });
      if (response.ok) {
        setFavoritos(prev => prev.filter(p => p.id !== produtoId));
      }
    } catch (error) {
      console.error('Erro ao remover dos favoritos:', error);
    }
  };

  const value = {
    favoritos,
    adicionarAosFavoritos,
    removerDosFavoritos,
    refetchFavoritos: fetchFavoritos,
  };

  return <FavoritosContext.Provider value={value}>{children}</FavoritosContext.Provider>;
}

export function useFavoritos() {
  const context = useContext(FavoritosContext);
  if (!context) {
    throw new Error('useFavoritos deve ser usado dentro de um FavoritosProvider');
  }
  return context;
}
