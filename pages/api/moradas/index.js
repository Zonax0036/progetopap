import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { pool } from '@/lib/conectarDB';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user?.id) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  const userId = session.user.id;

  if (req.method === 'GET') {
    try {
      const [rows] = await pool.execute('SELECT * FROM moradas WHERE user_id = ?', [userId]);
      res.status(200).json(rows);
    } catch (error) {
      console.error('Erro ao buscar moradas:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  } else if (req.method === 'POST') {
    try {
      const { nome_morada, rua, numero, complemento, conselho, distrito, codigo_postal } = req.body;

      if (!nome_morada || !rua || !numero || !conselho || !distrito || !codigo_postal) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
      }

      const [result] = await pool.execute(
        'INSERT INTO moradas (user_id, nome_morada, rua, numero, complemento, conselho, distrito, codigo_postal) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [userId, nome_morada, rua, numero, complemento, conselho, distrito, codigo_postal],
      );

      res.status(201).json({ id: result.insertId, ...req.body });
    } catch (error) {
      const { nome_morada, rua, numero, complemento, conselho, distrito, codigo_postal } = req.body;
      console.error(
        'Erro ao criar endereço:',
        { userId, nome_morada, rua, numero, complemento, conselho, distrito, codigo_postal },
        error,
      );
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Método ${req.method} não permitido`);
  }
}
