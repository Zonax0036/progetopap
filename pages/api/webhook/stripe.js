import { buffer } from 'micro';
import Stripe from 'stripe';

import { pool } from '@/lib/conectarDB';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  console.log('Webhook received');
  if (req.method === 'POST') {
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'];

    let event;

    try {
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (err) {
      console.error(`❌ Erro na verificação da assinatura do webhook: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const { pedidoId } = session.metadata;

      if (!pedidoId) {
        console.error('❌ ID do pedido em falta nos metadados da sessão Stripe.');
        return res.status(400).send('ID do pedido em falta nos metadados.');
      }

      try {
        await pool.execute('UPDATE pedidos SET status = ? WHERE id = ?', ['Concluído', pedidoId]);
        console.log(`✅ Pedido ${pedidoId} atualizado para "Concluído".`);
      } catch (error) {
        console.error(`❌ Erro ao atualizar o pedido ${pedidoId}:`, error);
        return res.status(500).json({ error: 'Erro ao atualizar o status do pedido.' });
      }
    } else {
      console.warn(`🤷‍♀️ Evento de webhook não tratado: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
