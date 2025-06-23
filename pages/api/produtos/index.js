// pages/api/produtos.js
import { Banner } from '@/components/Banner'; // Ajuste conforme necessário
import { ProductCard } from '@/components/ProductCard'; // Ajuste conforme necessário
import FilterBar from '@/components/FilterBar'; // Adicione esta importação
import { useRouter } from 'next/router';
import conectarDB from '@/lib/conectarDB';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  const { categoria, pesquisa, min, max, ordenacao } = req.query;

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

    // Filtro por categoria
    if (categoria) {
      conditions.push('categorias.nome = ?');
      params.push(categoria);
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
