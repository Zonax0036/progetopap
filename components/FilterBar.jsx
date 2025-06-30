// components/FilterBar.jsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FaFilter, FaSort } from 'react-icons/fa';

export default function FilterBar() {
  // Acessa o router do Next.js para manipular parâmetros de URL
  const router = useRouter();
  // Extrai parâmetros de consulta da URL atual
  const { min, max, ordenacao, categoria, pesquisa } = router.query;

  // Estado local para gerenciar o intervalo de preços selecionado
  const [precoRange, setPrecoRange] = useState({
    min: min || '',
    max: max || '',
  });
  // Estado local para a opção de ordenação selecionada
  const [ordenacaoAtual, setOrdenacaoAtual] = useState(ordenacao || 'padrao');

  // Sincroniza os estados locais quando os parâmetros de URL mudam
  useEffect(() => {
    setPrecoRange({
      min: min || '',
      max: max || '',
    });
    setOrdenacaoAtual(ordenacao || 'padrao');
  }, [min, max, ordenacao]);

  // Aplica os filtros selecionados atualizando a URL
  const aplicarFiltros = () => {
    const query = { ...router.query };

    // Adiciona ou remove filtros de preço baseado nos valores
    if (precoRange.min) {
      query.min = precoRange.min;
    } else {
      delete query.min;
    }

    if (precoRange.max) {
      query.max = precoRange.max;
    } else {
      delete query.max;
    }

    // Adiciona ou remove ordenação
    if (ordenacaoAtual !== 'padrao') {
      query.ordenacao = ordenacaoAtual;
    } else {
      delete query.ordenacao;
    }

    // Navega para a mesma página com os novos parâmetros de consulta
    router.push({
      pathname: router.pathname,
      query,
    });
  };

  // Limpa todos os filtros mantendo apenas categoria e pesquisa
  const limparFiltros = () => {
    const query = {};

    // Preserva categoria e pesquisa se existirem
    if (categoria) {
      query.categoria = categoria;
    }
    if (pesquisa) {
      query.pesquisa = pesquisa;
    }

    router.push({
      pathname: router.pathname,
      query,
    });
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-6">
      {/* Cabeçalho com título e botão para limpar filtros */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium flex items-center">
          <FaFilter className="mr-2 text-blue-600" /> Filtrar e Ordenar
        </h2>
        {/* Mostra botão de limpar apenas se houver filtros ativos */}
        {(min || max || ordenacao) && (
          <button
            onClick={limparFiltros}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
          >
            Limpar filtros
          </button>
        )}
      </div>

      {/* Grid de controles de filtro */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Filtro de preço mínimo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Preço mínimo (€)</label>
          <input
            type="number"
            min="0"
            value={precoRange.min}
            onChange={e => setPrecoRange({ ...precoRange, min: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Mín"
          />
        </div>

        {/* Filtro de preço máximo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Preço máximo (€)</label>
          <input
            type="number"
            min="0"
            value={precoRange.max}
            onChange={e => setPrecoRange({ ...precoRange, max: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Máx"
          />
        </div>

        {/* NOTA: Há código misturado aqui que parece ser de outro componente */}

        {/* Seletor de ordenação */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <FaSort className="mr-1" /> Ordenar por
          </label>
          <select
            value={ordenacaoAtual}
            onChange={e => setOrdenacaoAtual(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="padrao">Relevância</option>
            <option value="preco_asc">Preço: Menor para Maior</option>
            <option value="preco_desc">Preço: Maior para Menor</option>
            <option value="nome_asc">Nome: A-Z</option>
            <option value="nome_desc">Nome: Z-A</option>
          </select>
        </div>
      </div>

      {/* Botão para aplicar os filtros */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={aplicarFiltros}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Aplicar Filtros
        </button>
      </div>
    </div>
  );
}
