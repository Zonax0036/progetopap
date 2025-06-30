import { useState, useEffect } from 'react';
import { getSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

import Link from 'next/link';

export default function PerfilPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [endereco, setEndereco] = useState('');
  const router = useRouter();

  useEffect(() => {
    const carregarPerfil = async () => {
      setLoading(true);
      const session = await getSession();

      if (!session) {
        router.push('/login');
        return;
      }

      setUser(session.user);
      setNome(session.user.name || '');
      setEmail(session.user.email || '');
      setEndereco(session.user.endereco || '');
      setLoading(false);
    };

    carregarPerfil();
  }, [router]);

  const salvarPerfil = async () => {
    setLoading(true);

    // Simulação de salvamento no banco de dados
    setTimeout(() => {
      setUser({ ...user, name: nome, email: email, endereco: endereco });
      setEditMode(false);
      setLoading(false);
      alert('Perfil atualizado com sucesso!');
    }, 1000);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Carregando perfil...</div>;
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        Não autenticado.{' '}
        <Link href="/login" className="ml-2 text-blue-600">
          Faça login
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-12">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        {/* Cabeçalho com imagem de fundo e foto do perfil */}
        <div
          className="relative h-48 bg-cover bg-center"
          style={{ backgroundImage: 'url(/capa-perfil.jpg)' }}
        >
          {/* Substitui a imagem do usuário por um ícone padrão */}
          <div className="absolute bottom-0 left-4 transform -translate-y-1/2 border-4 border-white rounded-full h-32 w-32 bg-gray-300 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-20 w-20 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="p-8">
          {editMode ? (
            <div>
              <h1 className="text-2xl font-semibold text-gray-800 mb-4">Editar Perfil</h1>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nome">
                  Nome Completo:
                </label>
                <input
                  type="text"
                  id="nome"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="endereco">
                  Endereço:
                </label>
                <input
                  type="text"
                  id="endereco"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={endereco}
                  onChange={e => setEndereco(e.target.value)}
                />
              </div>

              <div className="flex justify-between">
                <button
                  onClick={salvarPerfil}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Salvar
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h1 className="text-2xl font-semibold text-gray-800 mb-4">{user.name}</h1>
              <p className="text-gray-600 mb-4">{user.email}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-700 mb-2">
                    Informações de Contato
                  </h2>
                  <p className="text-gray-500">Endereço: {endereco || 'Não Informado'}</p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-700 mb-2">Outras Informações</h2>
                  <p className="text-gray-500">Gênero: Não Informado</p>
                </div>
              </div>

              <div className="flex justify-between items-center mt-8">
                <button
                  onClick={() => setEditMode(true)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Editar Perfil
                </button>
                <button
                  onClick={() => signOut({ redirect: true, callbackUrl: '/' })}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Sair
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
