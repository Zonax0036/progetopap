import { pool } from '@/lib/conectarDB';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: 'Não autorizado' });
  }

  const userId = session.user.id;

  if (req.method === 'POST') {
    try {
      await pool.query('DELETE FROM carrinho WHERE user_id = ?', [userId]);
      res.status(200).json({ message: 'Carrinho esvaziado com sucesso' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao esvaziar o carrinho', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Método ${req.method} não permitido`);
  }
}
