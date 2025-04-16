import conectarDB from '@/lib/conectarDB';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  const { categoria, pesquisa } = req.query;

  let connection;

  try {
    connection = await conectarDB();

    let query = `
      SELECT
        produtos.id,
        produtos.nome,
        produtos.descricao,
        produtos.preco,
        produtos.imagem,
        categorias.nome AS categoria
      FROM produtos
      JOIN categorias ON produtos.categoria_id = categorias.id
    `;

    const conditions = [];
    const params = [];

    if (categoria) {
      conditions.push('categorias.nome = ?');
      params.push(categoria);
    }

    if (pesquisa) {
      conditions.push('produtos.nome LIKE ?');
      params.push(`%${pesquisa}%`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY produtos.nome ASC';

    const [rows] = await connection.execute(query, params);

    res.status(200).json(rows);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ error: 'Erro ao buscar produtos.' });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
