import { pool } from '@/lib/conectarDB';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: 'Não autorizado' });
  }

  const userId = session.user.id;

  switch (req.method) {
    case 'GET':
      try {
        const [rows] = await pool.execute(
          'SELECT id, nome, email, nif, email_fatura FROM usuarios WHERE id = ?',
          [userId],
        );
        if (rows.length === 0) {
          return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        res.status(200).json(rows[0]);
      } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar o perfil', error: error.message });
      }
      break;

    case 'PUT':
      try {
        const { nome, email, nif, email_fatura } = req.body;
        if (!nome || !email) {
          return res.status(400).json({ message: 'Dados inválidos' });
        }

        await pool.execute(
          'UPDATE usuarios SET nome = ?, email = ?, nif = ?, email_fatura = ? WHERE id = ?',
          [nome, email, nif, email_fatura, userId],
        );
        res.status(200).json({ message: 'Perfil atualizado com sucesso' });
      } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar o perfil', error: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      res.status(405).end(`Método ${req.method} não permitido`);
  }
}
