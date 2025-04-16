import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export function useProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { categoria, pesquisa } = router.query;

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (categoria) {
          params.append('categoria', categoria);
        }
        if (pesquisa) {
          params.append('pesquisa', pesquisa);
        }
        const url = `/api/produtos${params.toString() ? `?${params.toString()}` : ''}`;
        const { data } = await axios.get(url);
        setProdutos(data);
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        setProdutos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProdutos();
  }, [categoria, pesquisa]);

  return { produtos, loading };
}
