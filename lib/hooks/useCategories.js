// hooks/useCategorias.js
import { useEffect, useState } from 'react';
import axios from 'axios';

export function useCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const carregarCategorias = async () => {
      try {
        const { data } = await axios.get('/api/categorias');
        setCategorias(data);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        setErro(error);
        setCategorias([]);
      } finally {
        setLoading(false);
      }
    };

    carregarCategorias();
  }, []);

  return { categorias, loading, erro };
}
