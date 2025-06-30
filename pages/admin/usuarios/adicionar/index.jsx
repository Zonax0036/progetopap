import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaUser, FaEnvelope, FaLock, FaArrowLeft, FaUserPlus } from 'react-icons/fa';
import AdminLayout from '../../../../components/admin/AdminLayout';

function AdicionarUsuario() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async e => {
    e.preventDefault();
    setErro('');

    if (!nome || !email || !senha) {
      setErro('Todos os campos são obrigatórios!');
      return;
    }

    if (senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres!');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('/api/usuarios', {
        nome,
        email,
        senha,
      });

      if (response.status === 201) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/admin/usuarios');
        }, 2000);
      }
    } catch (error) {
      console.error('Erro ao adicionar usuário:', error);
      setErro(error.response?.data?.erro || 'Erro ao criar usuário.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-10 p-8 bg-white rounded-xl shadow-lg">
      <div>
        <div className="flex justify-center">
          <div className="bg-blue-600 text-white p-3 rounded-xl">
            <FaUserPlus className="h-10 w-10" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Adicionar Novo Usuário
        </h2>
      </div>

      {erro && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4">
          <p className="text-sm text-red-700">{erro}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 my-4">
          <p className="text-sm text-green-700">
            Usuário adicionado com sucesso! Redirecionando...
          </p>
        </div>
      )}

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="rounded-md shadow-sm space-y-4">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
              Nome Completo
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="nome"
                name="nome"
                type="text"
                required
                value={nome}
                onChange={e => setNome(e.target.value)}
                className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Nome do usuário"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Email do usuário"
              />
            </div>
          </div>

          <div>
            <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="senha"
                name="senha"
                type="password"
                required
                value={senha}
                onChange={e => setSenha(e.target.value)}
                className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Senha (mínimo 6 caracteres)"
              />
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading || success}
            className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${
              loading || success ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200`}
          >
            {loading ? 'Adicionando...' : success ? 'Adicionado!' : 'Adicionar Usuário'}
          </button>
        </div>
      </form>

      <div className="text-center mt-4">
        <Link
          href="/admin/usuarios"
          className="text-sm text-blue-600 hover:text-blue-500 flex items-center justify-center"
        >
          <FaArrowLeft className="mr-2" /> Voltar para a lista de usuários
        </Link>
      </div>
    </div>
  );
}

AdicionarUsuario.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default AdicionarUsuario;
