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
        const [rows] = await pool.query(
          `SELECT p.id, p.nome, p.preco, p.imagem, c.quantidade
           FROM carrinho c
           JOIN produtos p ON c.produto_id = p.id
           WHERE c.user_id = ?`,
          [userId],
        );
        res.status(200).json(rows);
      } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar o carrinho', error: error.message });
      }
      break;

    case 'POST':
      try {
        const { produto_id, quantidade } = req.body;
        if (!produto_id || !quantidade) {
          return res.status(400).json({ message: 'Dados inválidos' });
        }

        await pool.query(
          'INSERT INTO carrinho (user_id, produto_id, quantidade) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantidade = ?',
          [userId, produto_id, quantidade, quantidade],
        );
        res.status(201).json({ message: 'Produto adicionado/atualizado no carrinho' });
      } catch (error) {
        res.status(500).json({ message: 'Erro ao adicionar ao carrinho', error: error.message });
      }
      break;

    case 'DELETE':
      try {
        const { produto_id } = req.body;
        if (!produto_id) {
          return res.status(400).json({ message: 'ID do produto em falta' });
        }

        await pool.query('DELETE FROM carrinho WHERE user_id = ? AND produto_id = ?', [
          userId,
          produto_id,
        ]);
        res.status(200).json({ message: 'Produto removido do carrinho' });
      } catch (error) {
        res.status(500).json({ message: 'Erro ao remover do carrinho', error: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      res.status(405).end(`Método ${req.method} não permitido`);
  }
}
