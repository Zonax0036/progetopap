import { pool } from '@/lib/conectarDB';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const [rows] = await pool.query(`
        SELECT
          p.id,
          p.nome,
          p.preco,
          p.imagem,
          c.nome as categoria,
          SUM(pi.quantidade) as total_vendido,
          SUM(pi.quantidade * pi.preco) as receita_total
        FROM produtos p
        JOIN pedido_itens pi ON p.id = pi.produto_id
        JOIN categorias c ON p.categoria_id = c.id
        GROUP BY p.id, p.nome, p.preco, p.imagem, c.nome
        ORDER BY total_vendido DESC;
      `);

      res.status(200).json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao buscar relatório de produtos.' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Método ${req.method} não permitido.`);
  }
}
