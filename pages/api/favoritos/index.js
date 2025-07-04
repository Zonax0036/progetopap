import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/auth';
import { pool } from '../../../lib/conectarDB';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: 'Não autorizado' });
  }

  const userId = session.user.id;

  switch (req.method) {
    case 'POST':
      try {
        const { produto_id } = req.body;
        if (!produto_id) {
          return res.status(400).json({ message: 'ID do produto é obrigatório' });
        }

        const [result] = await pool.query(
          'INSERT INTO favoritos (user_id, produto_id) VALUES (?, ?)',
          [userId, produto_id],
        );

        res.status(201).json({ id: result.insertId, user_id: userId, produto_id });
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ message: 'Produto já está nos favoritos' });
        }
        res.status(500).json({ message: 'Erro ao adicionar aos favoritos', error: error.message });
      }
      break;

    case 'DELETE':
      try {
        const { produto_id } = req.body;
        if (!produto_id) {
          return res.status(400).json({ message: 'ID do produto é obrigatório' });
        }

        await pool.query('DELETE FROM favoritos WHERE user_id = ? AND produto_id = ?', [
          userId,
          produto_id,
        ]);

        res.status(200).json({ message: 'Produto removido dos favoritos' });
      } catch (error) {
        res.status(500).json({ message: 'Erro ao remover dos favoritos', error: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['POST', 'DELETE']);
      res.status(405).end(`Método ${req.method} não permitido`);
  }
}
