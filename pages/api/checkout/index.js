import Stripe from 'stripe';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const session = await getServerSession(req, res, authOptions);
      if (!session || !session.user?.id) {
        return res.status(401).json({ error: 'Não autenticado' });
      }

      const { items, pedidoId } = req.body;

      if (!items || items.length === 0) {
        return res.status(400).json({ error: 'Carrinho vazio' });
      }
      if (!pedidoId) {
        return res.status(400).json({ error: 'ID do pedido em falta.' });
      }

      const line_items = items.map(item => {
        return {
          price_data: {
            currency: 'eur',
            product_data: {
              name: item.nome,
              images: [item.imagem_url],
            },
            unit_amount: Math.round(item.preco * 100), // Preço em cêntimos
          },
          quantity: item.quantidade,
        };
      });

      const stripeSession = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items,
        mode: 'payment',
        success_url: `${req.headers.origin}/sucesso?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/carrinho`,
        metadata: {
          pedidoId: pedidoId,
        },
      });

      res.status(200).json({ sessionId: stripeSession.id });
    } catch (err) {
      console.error('Erro ao criar sessão de checkout do Stripe:', err);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
