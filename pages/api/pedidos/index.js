import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import conectarDB from '@/lib/conectarDB';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user?.email) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  const connection = await conectarDB();
  if (!connection) {
    return res.status(500).json({ error: 'Erro na conexão com o banco de dados' });
  }

  try {
    const [rows] = await connection.execute(
      'SELECT * FROM pedidos WHERE email = ? ORDER BY data DESC',
      [session.user.email],
    );

    return res.status(200).json(rows);
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    return res.status(500).json({ error: 'Erro ao buscar pedidos' });
  } finally {
    await connection.end();
  }
}
