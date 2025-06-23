import { useState, useEffect, useCallback } from 'react';
import { FaEdit, FaTrash, FaUserLock, FaUserCheck, FaSearch } from 'react-icons/fa';

export function GerenciamentoUsuarios({ loading: initialLoading }) {
  const [usuarios, setUsuarios] = useState([]);
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [filtro, setFiltro] = useState('');
  const [erro, setErro] = useState('');
  const [tentativas, setTentativas] = useState(0);

  // Função para buscar os usuários do backend
  const carregarUsuarios = useCallback(async () => {
    if (tentativas > 3) return; // Evita tentar infinitamente

    setIsLoading(true);
    setErro('');
    try {
      const response = await fetch('/api/usuarios');
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          console.error('Resposta não é JSON válido:', errorText);
          errorData = { erro: 'Formato de resposta inválido' };
        }
        
        setErro(`Erro (${response.status}): ${errorData?.erro || 'Erro desconhecido'}`);
        console.error('Erro na resposta:', response.status, errorData);
        setUsuarios([]);
      } else {
        const data = await response.json();
        setUsuarios(data);
      }
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      setErro(`Falha na conexão: ${error.message}`);
      setUsuarios([]);
    } finally {
      setIsLoading(false);
      setTentativas(prev => prev + 1);
    }
  }, [tentativas]);

  useEffect(() => {
    carregarUsuarios();
  }, [carregarUsuarios]);

  // Função para alternar o status de um usuário (ativo/inativo)
  const alternarStatus = async (userId, statusAtual) => {
    try {
      const response = await fetch(`/api/usuarios/${userId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ativo: !statusAtual }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Erro ao alterar status: ${errorData.erro || 'Erro desconhecido'}`);
        return;
      }

      // Atualiza a lista de usuários localmente
      setUsuarios(prev => 
        prev.map(user => user.id === userId ? { ...user, ativo: !statusAtual } : user)
      );
    } catch (error) {
      console.error('Erro ao alterar status do usuário:', error);
      alert(`Falha na conexão: ${error.message}`);
    }
  };

  // Função para excluir um usuário
  const excluirUsuario = async (userId) => {
    if (!confirm('Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/usuarios/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Erro ao excluir usuário: ${errorData.erro || 'Erro desconhecido'}`);
        return;
      }

      // Remove o usuário da lista local
      setUsuarios(prev => prev.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      alert(`Falha na conexão: ${error.message}`);
    }
  };

  // Filtra os usuários com base na pesquisa
  const usuariosFiltrados = usuarios.filter(usuario => 
    usuario.nome?.toLowerCase().includes(filtro.toLowerCase()) ||
    usuario.email?.toLowerCase().includes(filtro.toLowerCase())
  );

  // Renderiza o estado de carregamento
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Renderiza o estado de erro
  if (erro) {
    return (
      <div className="bg-red-100 p-4 rounded text-red-700">
        <p className="font-bold text-center">Ocorreu um erro</p>
        <p className="text-center mb-4">{erro}</p>
        <div className="flex justify-center">
          <button 
            onClick={() => {setTentativas(0); carregarUsuarios();}}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  // Renderiza o estado vazio
  if (!usuarios || usuarios.length === 0) {
    return (
      <div className="bg-yellow-100 p-4 rounded text-yellow-700 text-center">
        <p>Nenhum usuário encontrado no sistema.</p>
        {tentativas > 0 && (
          <button 
            onClick={() => {setTentativas(0); carregarUsuarios();}}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-4"
          >
            Atualizar
          </button>
        )}
      </div>
    );
  }

  // Renderiza a tabela de usuários
  return (
    <div>
      <div className="mb-4 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar por nome ou email..."
          className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Data de Registro
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {usuariosFiltrados.map(usuario => (
              <tr key={usuario.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  {usuario.nome || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {usuario.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {usuario.dataCriacao ? new Date(usuario.dataCriacao).toLocaleDateString('pt-BR') : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    usuario.ativo 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {usuario.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                  <button
                    onClick={() => alternarStatus(usuario.id, usuario.ativo)}
                    className={`${
                      usuario.ativo 
                        ? 'text-red-600 hover:text-red-900' 
                        : 'text-green-600 hover:text-green-900'
                    }`}
                    title={usuario.ativo ? 'Desativar usuário' : 'Ativar usuário'}
                  >
                    {usuario.ativo ? <FaUserLock /> : <FaUserCheck />}
                  </button>
                  <button
                    onClick={() => excluirUsuario(usuario.id)}
                    className="text-red-600 hover:text-red-900"
                    title="Excluir usuário"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
