import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function EditarProduto() {
  const router = useRouter();
  const { id } = router.query;

  const [produto, setProduto] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [imagemFicheiro, setImagemFicheiro] = useState(null);

  useEffect(() => {
    if (!router.isReady || !id) {
      return;
    }

    const carregarDados = async () => {
      try {
        const [produtoRes, categoriasRes] = await Promise.all([
          axios.get(`/api/produtos/${id}`),
          axios.get('/api/categorias'),
        ]);

        setProduto(produtoRes.data);
        setCategorias(categoriasRes.data);
      } catch (err) {
        console.error(err);
        setErro('Erro ao carregar os dados.');
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [router.isReady, id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setProduto(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    let imageUrl = produto.imagem;

    try {
      if (imagemFicheiro) {
        const formData = new FormData();
        formData.append('file', imagemFicheiro);
        formData.append('productName', produto.nome);

        const response = await axios.post('/api/produtos/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        imageUrl = response.data.imageUrl;
      }

      await axios.put(`/api/produtos/${id}`, { ...produto, imagem: imageUrl });
      setMensagem('Produto atualizado com sucesso!');
      setErro('');
      setImagemFicheiro(null);
    } catch (err) {
      console.error(err);
      setErro('Erro ao atualizar produto.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="p-4">Carregando...</p>;
  }
  if (erro) {
    return <p className="p-4 text-red-500">{erro}</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Editar Produto</h1>

      {mensagem && <p className="text-green-600 mb-4">{mensagem}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 shadow rounded-lg">
        <div>
          <label className="block font-medium">Nome</label>
          <input
            type="text"
            name="nome"
            value={produto.nome || ''}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Preço (€)</label>
          <input
            type="number"
            name="preco"
            value={produto.preco || ''}
            onChange={handleChange}
            step="0.01"
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Descrição</label>
          <textarea
            name="descricao"
            value={produto.descricao || ''}
            onChange={handleChange}
            className="w-full border p-2 rounded min-h-[80px]"
          />
        </div>

        <div>
          <label className="block font-medium">Imagem do Produto</label>
          <input
            type="file"
            onChange={e => setImagemFicheiro(e.target.files[0])}
            className="w-full p-2 border rounded"
            accept="image/*"
          />
          <div className="mt-2">
            {imagemFicheiro ? (
              <img
                src={URL.createObjectURL(imagemFicheiro)}
                alt="Nova pré-visualização"
                className="max-h-40 object-contain rounded"
              />
            ) : (
              produto.imagem && (
                <img
                  src={produto.imagem}
                  alt="Imagem atual"
                  className="max-h-40 object-contain rounded"
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/150?text=Imagem+Inválida';
                  }}
                />
              )
            )}
          </div>
        </div>

        <div>
          <label className="block font-medium">Categoria</label>
          <select
            name="categoria_id"
            value={produto.categoria_id}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Selecione uma categoria</option>
            {categorias.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.nome}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Salvar Alterações
        </button>
      </form>
    </div>
  );
}
