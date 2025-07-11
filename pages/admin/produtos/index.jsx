import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { FaPlus, FaSearch } from 'react-icons/fa';
import { TabelaProdutos } from '@/pages/admin/produtos/components/TabelaProdutos';
import { DialogConfirm } from '@/components/ui/DialogConfirm';
import AdminLayout from '@/components/admin/AdminLayout';

function Produtos({ initialProdutos, initialTotal }) {
  const [produtos, setProdutos] = useState(initialProdutos);
  const [total, setTotal] = useState(initialTotal);
  const [pagina, setPagina] = useState(1);
  const [ordenacao, setOrdenacao] = useState('nome_asc');
  const [limite] = useState(15);
  const [pesquisa, setPesquisa] = useState('');
  const [loading, setLoading] = useState(false);

  const dialogRef = useRef(null);
  const produtoAExcluir = useRef(null);

  useEffect(() => {
    const fetchProdutos = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/produtos`, {
          params: { pagina, limite, pesquisa, ordenacao },
        });
        setProdutos(res.data.produtos);
        setTotal(res.data.total);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProdutos();
  }, [pagina, limite, pesquisa]);

  const excluirProduto = id => {
    produtoAExcluir.current = id;
    dialogRef.current?.showModal();
  };

  const confirmarExclusao = async () => {
    if (!produtoAExcluir.current) {
      return;
    }

    try {
      await axios.delete(`/api/produtos/${produtoAExcluir.current}`);
      produtoAExcluir.current = null;
      window.location.reload(); // ou você pode usar useState + setProdutos
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
    } finally {
      dialogRef.current.close();
    }
  };

  const totalPaginas = Math.ceil(total / limite);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Painel Administrativo</h1>
        <Link
          href="/admin/produtos/adicionar"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <FaPlus className="mr-2" /> Adicionar Produto
        </Link>
      </div>

      <div className="mb-4 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar por nome ou descrição..."
          className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={pesquisa}
          onChange={e => {
            setPesquisa(e.target.value);
            setPagina(1);
          }}
        />
      </div>

      <TabelaProdutos produtos={produtos} onExcluir={excluirProduto} loading={loading} />

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPagina(p => Math.max(1, p - 1))}
          disabled={pagina === 1}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <span>
          Página {pagina} de {totalPaginas}
        </span>
        <button
          onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
          disabled={pagina === totalPaginas}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Próxima
        </button>
      </div>

      <DialogConfirm
        ref={dialogRef}
        onConfirm={confirmarExclusao}
        title="Excluir Produto"
        message="Tem certeza que deseja excluir este produto? Essa ação não poderá ser desfeita."
      />
    </div>
  );
}

Produtos.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};

export async function getServerSideProps(context) {
  const { getSession } = await import('next-auth/react');
  const session = await getSession(context);

  if (!session || session.user.role !== 'admin') {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  try {
    const { pagina = 1, limite = 10, ordenacao = 'nome_asc' } = context.query;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/produtos?pagina=${pagina}&limite=${limite}&ordenacao=${ordenacao}`,
      {
        headers: {
          Cookie: context.req.headers.cookie || '',
        },
      },
    );
    const data = await res.json();

    return {
      props: {
        initialProdutos: data.produtos,
        initialTotal: data.total,
      },
    };
  } catch (error) {
    console.error('Erro ao carregar produtos:', error);
    return {
      props: {
        initialProdutos: [],
        initialTotal: 0,
      },
    };
  }
}

export default Produtos;
