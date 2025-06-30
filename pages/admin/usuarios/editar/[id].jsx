import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { LoadingSpinner } from '../../../../components/Loading';
import AdminLayout from '../../../../components/admin/AdminLayout';

function EditarUsuarioPage() {
  const router = useRouter();
  const { id } = router.query;
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetch(`/api/usuarios/${id}`)
        .then(res => {
          if (!res.ok) {
            throw new Error('Falha ao carregar usuário');
          }
          return res.json();
        })
        .then(data => {
          setUsuario(data);
          setLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setUsuario(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/usuarios/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.erro || 'Falha ao atualizar usuário');
      }

      alert('Usuário atualizado com sucesso!');
      router.push('/admin/usuarios');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-red-500">Erro: {error}</div>;
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Editar Usuário</h1>
      {usuario && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nome">Nome</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={usuario.nome}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={usuario.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={usuario.role}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Salvar Alterações
          </button>
        </form>
      )}
    </>
  );
}

export default EditarUsuarioPage;
