import { useRef } from 'react';
import axios from 'axios';
import { PainelAdmin } from '@/components/admin/PainelAdmin';
import { DialogConfirm } from '@/components/ui/DialogConfirm';
import AdminLayout from '@/components/admin/AdminLayout';

function AdminDashboard({ produtos }) {
  const dialogRef = useRef(null);
  const produtoAExcluir = useRef(null);

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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Painel Administrativo</h1>

      <PainelAdmin produtos={produtos} onExcluir={excluirProduto} loading={false} />

      <DialogConfirm
        ref={dialogRef}
        onConfirm={confirmarExclusao}
        title="Excluir Produto"
        message="Tem certeza que deseja excluir este produto? Essa ação não poderá ser desfeita."
      />
    </div>
  );
}

AdminDashboard.getLayout = function getLayout(page) {
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
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/produtos`, {
      headers: {
        Cookie: context.req.headers.cookie || '',
      },
    });
    const produtos = await res.json();

    return {
      props: {
        produtos,
      },
    };
  } catch (error) {
    console.error('Erro ao carregar produtos:', error);
    return {
      props: {
        produtos: [],
      },
    };
  }
}

export default AdminDashboard;
