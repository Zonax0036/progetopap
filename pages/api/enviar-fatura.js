import { Resend } from 'resend';
import { FaturaEmail } from '../../emails/FaturaEmail';
import { pool } from '@/lib/conectarDB';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: 'Não autorizado' });
  }

  try {
    const { pedidoId } = req.body;

    if (!pedidoId) {
      return res.status(400).json({ message: 'ID do pedido em falta' });
    }

    // Buscar dados do pedido
    const [pedidoRows] = await pool.execute('SELECT * FROM pedidos WHERE id = ? AND user_id = ?', [
      pedidoId,
      session.user.id,
    ]);
    const pedido = pedidoRows[0];

    if (!pedido) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }

    // Buscar itens do pedido
    const [itensRows] = await pool.execute(
      'SELECT pi.*, p.nome FROM pedido_itens pi JOIN produtos p ON pi.produto_id = p.id WHERE pi.pedido_id = ?',
      [pedidoId],
    );

    // Buscar dados do usuário (incluindo NIF)
    const [userRows] = await pool.execute('SELECT * FROM usuarios WHERE id = ?', [session.user.id]);
    const user = userRows[0];

    const emailParaFatura = user.email_fatura || user.email;

    const fatura = {
      numero: `FAT-${pedido.id.toString().padStart(6, '0')}`,
      data: new Date(pedido.data_criacao).toLocaleDateString('pt-PT'),
      cliente: {
        nome: user.nome,
        email: emailParaFatura,
        nif: user.nif || 'N/A',
      },
      itens: itensRows.map(item => ({
        id: item.produto_id,
        nome: item.nome,
        quantidade: item.quantidade,
        preco_unitario: parseFloat(item.preco_unitario),
      })),
      subtotal: parseFloat(pedido.subtotal),
      desconto: parseFloat(pedido.valor_desconto),
      entrega: parseFloat(pedido.valor_entrega),
      total: parseFloat(pedido.total),
    };

    await resend.emails.send({
      from: 'Loja Desportiva <onboarding@resend.dev>',
      to: [emailParaFatura],
      subject: `Fatura do seu pedido #${pedido.id}`,
      react: FaturaEmail({ fatura }),
    });

    res.status(200).json({ message: 'Email da fatura enviado com sucesso!' });
  } catch (error) {
    console.error(
      `Erro ao enviar email da fatura para o pedido ${pedidoId} para o email ${emailParaFatura}:`,
      error,
    );
    res.status(500).json({ message: 'Erro ao enviar email da fatura', error: error.message });
  }
}
