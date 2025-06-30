import { pool } from '@/lib/conectarDB';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';

async function handleGet(req, res) {
  const { categoria, pesquisa, min, max, ordenacao, pagina = 1, limite = 10 } = req.query;

  try {
    let query = `
      SELECT
        produtos.id,
        produtos.nome,
        produtos.descricao,
        produtos.preco,
        produtos.imagem,
        produtos.data_criacao,
        categorias.nome AS categoria
      FROM produtos
      JOIN categorias ON produtos.categoria_id = categorias.id
    `;

    const conditions = [];
    const params = [];

    // Filtro por categoria
    if (categoria) {
      conditions.push('produtos.categoria_id = ?');
      params.push(parseInt(categoria, 10));
    }

    // Filtro por pesquisa
    if (pesquisa) {
      conditions.push('(produtos.nome LIKE ? OR produtos.descricao LIKE ?)');
      params.push(`%${pesquisa}%`, `%${pesquisa}%`);
    }

    // Filtro por preço mínimo
    if (min) {
      conditions.push('produtos.preco >= ?');
      params.push(parseFloat(min));
    }

    // Filtro por preço máximo
    if (max) {
      conditions.push('produtos.preco <= ?');
      params.push(parseFloat(max));
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    // Ordenação
    switch (ordenacao) {
      case 'preco_asc':
        query += ' ORDER BY produtos.preco ASC';
        break;
      case 'preco_desc':
        query += ' ORDER BY produtos.preco DESC';
        break;
      case 'nome_asc':
        query += ' ORDER BY produtos.nome ASC';
        break;
      case 'nome_desc':
        query += ' ORDER BY produtos.nome DESC';
        break;
      default:
        query += ' ORDER BY produtos.id DESC'; // Ordenação padrão
    }

    const offset = (pagina - 1) * limite;
    const limitClause = ` LIMIT ${parseInt(limite)} OFFSET ${parseInt(offset)}`;

    // Contar o total de produtos para a paginação
    const countQuery =
      `SELECT COUNT(*) as total FROM produtos JOIN categorias ON produtos.categoria_id = categorias.id` +
      (conditions.length > 0 ? ` WHERE ${conditions.join(' AND ')}` : '');
    const [totalRows] = await pool.execute(countQuery, params);
    const total = totalRows[0].total;

    const [rows] = await pool.execute(query + limitClause, params);

    res.status(200).json({ produtos: rows, total });
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ error: 'Erro ao buscar produtos.' });
  }
}

async function handlePost(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ erro: 'Não autenticado' });
  }

  const { nome, descricao = '', preco, imagem = '', categoria } = req.body;

  // Validação básica
  if (!nome || !preco || !categoria) {
    return res.status(400).json({ erro: 'Campos obrigatórios não preenchidos' });
  }

  try {
    const query = `
      INSERT INTO produtos (nome, descricao, preco, imagem, categoria_id)
      VALUES (?, ?, ?, ?, ?)
    `;

    await pool.execute(query, [nome, descricao, preco, imagem, categoria]);

    return res.status(200).json({ mensagem: 'Produto adicionado com sucesso' });
  } catch (error) {
    console.error('Erro ao adicionar produto:', error);
    return res.status(500).json({ erro: 'Erro no servidor' });
  }
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return handleGet(req, res);
  } else if (req.method === 'POST') {
    return handlePost(req, res);
  } else {
    return res.status(405).json({ error: 'Método não permitido.' });
  }
}
