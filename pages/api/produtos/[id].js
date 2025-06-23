import conectarDB from '@/lib/conectarDB';
import FilterBar from '@/components/FilterBar';

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: 'ID inválido.' });
  }

  let connection;

  try {
    connection = await conectarDB();

    if (req.method === 'GET') {
      const [rows] = await connection.execute('SELECT * FROM produtos WHERE id = ? LIMIT 1', [id]);

      const produto = rows[0];

      if (!produto) {
        return res.status(404).json({ error: 'Produto não encontrado.' });
      }

      return res.status(200).json(produto);
    }

    if (req.method === 'PUT') {
      const { nome, descricao, preco, categoria_id, imagem } = req.body;
      
      // Verificar se o produto existe antes de atualizar
      const [checkRows] = await connection.execute('SELECT id FROM produtos WHERE id = ?', [id]);
      
      if (checkRows.length === 0) {
        return res.status(404).json({ error: 'Produto não encontrado.' });
      }
      
      // Validar dados obrigatórios
      if (!nome || !preco || preco <= 0) {
        return res.status(400).json({ error: 'Nome e preço são obrigatórios. O preço deve ser maior que zero.' });
      }
      
      // Atualizar o produto no banco de dados
      await connection.execute(
        'UPDATE produtos SET nome = ?, descricao = ?, preco = ?, categoria_id = ?, imagem = ? WHERE id = ?',
        [nome, descricao || null, preco || 0,categoria_id || null, imagem || null, id]
      );
      
      return res.status(200).json({ message: 'Produto atualizado com sucesso.' });
    }

    if (req.method === 'DELETE') {
      // Primeiro, verificar se o produto existe
      const [rows] = await connection.execute('SELECT id FROM produtos WHERE id = ?', [id]);

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Produto não encontrado.' });
      }

      await connection.execute('DELETE FROM produtos WHERE id = ?', [id]);

      return res.status(200).json({ message: 'Produto excluído com sucesso.' });
    }

    return res.status(405).json({ error: 'Método não permitido.' });
  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
