import Stripe from 'stripe';
import { pool } from '@/lib/conectarDB';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const nextAuthSession = await getServerSession(req, res, authOptions);
      if (!nextAuthSession) {
        return res.status(401).json({ error: 'Não autorizado' });
      }

      const { session_id } = req.body;

      if (!session_id) {
        return res.status(400).json({ error: 'ID da sessão em falta.' });
      }

      const stripeSession = await stripe.checkout.sessions.retrieve(session_id);

      if (stripeSession.payment_status === 'paid') {
        const { pedidoId } = stripeSession.metadata;

        if (!pedidoId) {
          return res.status(400).json({ error: 'ID do pedido em falta nos metadados.' });
        }

        // Adicionar verificação para garantir que o pedido pertence ao usuário logado
        const [pedidoRows] = await pool.execute('SELECT user_id FROM pedidos WHERE id = ?', [
          pedidoId,
        ]);

        if (pedidoRows.length === 0 || pedidoRows[0].user_id !== nextAuthSession.user.id) {
          return res.status(403).json({ error: 'Acesso negado a este pedido.' });
        }

        await pool.execute('UPDATE pedidos SET status = ? WHERE id = ?', ['Pago', pedidoId]);

        return res.status(200).json({ message: 'Pedido atualizado com sucesso.', pedidoId });
      } else {
        return res.status(400).json({ error: 'O pagamento não foi concluído.' });
      }
    } catch (err) {
      console.error('Erro ao confirmar pedido:', err);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
