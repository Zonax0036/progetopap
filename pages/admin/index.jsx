import { useEffect, useState, useCallback, useRef } from 'react';

import axios from 'axios';
import { useRequireAdmin } from '@/lib/hooks/useRequiredAdmin';
import { PainelAdmin } from '@/components/admin/PainelAdmin';
import { DialogConfirm } from '@/components/ui/DialogConfirm';
import AdminLayout from '@/components/admin/AdminLayout';

function AdminDashboard() {
  const { loading, authorized } = useRequireAdmin();
  const [produtos, setProdutos] = useState([]);
  const [carregandoProdutos, setCarregandoProdutos] = useState(true);

  const dialogRef = useRef(null);
  const produtoAExcluir = useRef(null);

  const carregarProdutos = useCallback(async () => {
    try {
      setCarregandoProdutos(true);
      const response = await axios.get('/api/produtos');
      setProdutos(response.data);
    } catch (err) {
      console.error('Erro ao carregar produtos:', err);
    } finally {
      setCarregandoProdutos(false);
    }
  }, []);

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
      carregarProdutos();
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
    } finally {
      dialogRef.current.close();
    }
  };

  useEffect(() => {
    if (authorized) {
      carregarProdutos();
    }
  }, [authorized, carregarProdutos]);

  if (loading) {
    return <p className="p-4 text-gray-600">Verificando permissões...</p>;
  }
  if (!authorized) {
    return null;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Painel Administrativo</h1>

      <PainelAdmin produtos={produtos} onExcluir={excluirProduto} loading={carregandoProdutos} />

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

export default AdminDashboard;
