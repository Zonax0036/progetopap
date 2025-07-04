import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/auth';
import { pool } from '../../../lib/conectarDB';

export default async function handler(req, res) {
  const { user_id } = req.query;
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.id !== parseInt(user_id)) {
    return res.status(401).json({ message: 'Não autorizado' });
  }

  if (req.method === 'GET') {
    try {
      const [favoritos] = await pool.query(
        `SELECT p.* FROM produtos p
         JOIN favoritos f ON p.id = f.produto_id
         WHERE f.user_id = ?`,
        [user_id],
      );

      res.status(200).json(favoritos || []);
    } catch (error) {
      console.error('Error fetching favoritos:', error);
      res.status(500).json({ message: 'Erro ao buscar os favoritos', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Método ${req.method} não permitido`);
  }
}
