import Stripe from 'stripe';
import { pool } from '@/lib/conectarDB';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { session_id } = req.body;

      if (!session_id) {
        return res.status(400).json({ error: 'ID da sessão em falta.' });
      }

      const session = await stripe.checkout.sessions.retrieve(session_id);

      if (session.payment_status === 'paid') {
        const { pedidoId } = session.metadata;

        if (!pedidoId) {
          return res.status(400).json({ error: 'ID do pedido em falta nos metadados.' });
        }

        await pool.execute('UPDATE pedidos SET status = ? WHERE id = ?', ['Pago', pedidoId]);

        return res.status(200).json({ message: 'Pedido atualizado com sucesso.' });
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
