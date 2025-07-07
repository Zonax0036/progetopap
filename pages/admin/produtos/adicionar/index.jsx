import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

import { useSession } from 'next-auth/react';

export default function AdicionarProduto() {
  const { data: session, status } = useSession();
  const router = useRouter();

  console.log({ session });

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [imagem, setImagem] = useState('');
  const [imagemFicheiro, setImagemFicheiro] = useState(null);
  const [categoria, setCategoria] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Carregar categorias disponíveis
  useEffect(() => {
    const carregarCategorias = async () => {
      try {
        const response = await axios.get('/api/categorias');
        setCategorias(response.data);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
      }
    };

    carregarCategorias();
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();

    if (!nome || !preco || !categoria) {
      setErro('Nome, preço e categoria são obrigatórios');
      return;
    }

    const precoNumerico = parseFloat(preco.replace(',', '.'));
    if (isNaN(precoNumerico)) {
      setErro('Preço inválido. Use apenas números.');
      return;
    }

    setLoading(true);
    setErro('');

    let imageUrl = imagem;

    try {
      if (imagemFicheiro) {
        const formData = new FormData();
        formData.append('file', imagemFicheiro);
        formData.append('productName', nome);

        const response = await axios.post('/api/produtos/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        imageUrl = response.data.imageUrl;
      }

      await axios.post('/api/produtos', {
        nome,
        descricao,
        preco: precoNumerico,
        imagem: imageUrl,
        categoria,
      });

      setSuccess(true);
      setNome('');
      setDescricao('');
      setPreco('');
      setImagem('');
      setImagemFicheiro(null);
      setCategoria('');

      setTimeout(() => {
        router.push('/admin/produtos');
      }, 1000);
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
      setErro(error.response?.data?.erro || 'Erro ao adicionar produto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Adicionar Novo Produto</h1>

      {erro && <div className="bg-red-100 p-3 rounded text-red-700 mb-4">{erro}</div>}

      {success && (
        <div className="bg-green-100 p-3 rounded text-green-700 mb-4">
          Produto adicionado com sucesso! Redirecionando...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nome do Produto */}
        <div>
          <label className="block text-gray-700 mb-1">Nome do Produto *</label>
          <input
            type="text"
            value={nome}
            onChange={e => setNome(e.target.value)}
            className="w-full p-2 border rounded"
            disabled={loading}
          />
        </div>

        {/* Descrição */}
        <div>
          <label className="block text-gray-700 mb-1">Descrição</label>
          <textarea
            value={descricao}
            onChange={e => setDescricao(e.target.value)}
            className="w-full p-2 border rounded min-h-[100px]"
            disabled={loading}
          />
        </div>

        {/* Preço */}
        <div>
          <label className="block text-gray-700 mb-1">Preço *</label>
          <input
            type="text"
            value={preco}
            onChange={e => setPreco(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Ex: 99.99"
            disabled={loading}
          />
        </div>

        {/* URL da Imagem */}
        <div>
          <label className="block text-gray-700 mb-1">Imagem do Produto</label>
          <input
            type="file"
            onChange={e => setImagemFicheiro(e.target.files[0])}
            className="w-full p-2 border rounded"
            disabled={loading}
            accept="image/*"
          />
          {imagemFicheiro && (
            <div className="mt-2">
              <img
                src={URL.createObjectURL(imagemFicheiro)}
                alt="Preview"
                className="max-h-40 object-contain"
              />
            </div>
          )}
        </div>

        {/* Categoria */}
        <div>
          <label className="block text-gray-700 mb-1">Categoria *</label>
          <select
            value={categoria}
            onChange={e => setCategoria(e.target.value)}
            className="w-full p-2 border rounded"
            disabled={loading}
          >
            <option value="">Selecione uma categoria</option>
            {categorias.map((cat, index) => (
              <option key={index} value={cat.id}>
                {cat.nome}
              </option>
            ))}
          </select>
        </div>

        {/* Botões */}
        <div className="flex space-x-2">
          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Adicionando...' : 'Adicionar Produto'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/')}
            disabled={loading}
            className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
