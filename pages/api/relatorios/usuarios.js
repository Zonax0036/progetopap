import { pool } from '@/lib/conectarDB';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const [rows] = await pool.query(`
        SELECT
          u.id,
          u.nome,
          u.email,
          u.role,
          u.ativo,
          u.data_criacao,
          u.ultimo_login,
          COUNT(p.id) as total_pedidos,
          SUM(p.total) as total_gasto
        FROM usuarios u
        LEFT JOIN pedidos p ON u.id = p.user_id
        GROUP BY u.id, u.nome, u.email, u.role, u.ativo, u.data_criacao, u.ultimo_login
        ORDER BY total_gasto DESC;
      `);

      res.status(200).json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao buscar relatório de usuários.' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Método ${req.method} não permitido.`);
  }
}
