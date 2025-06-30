import { pool } from '@/lib/conectarDB';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { codigo } = req.query;

  if (!codigo) {
    return res.status(400).json({ error: 'Código do cupom é obrigatório' });
  }

  try {
    const [rows] = await pool.execute(
      `SELECT * FROM cupons
       WHERE codigo = ?
       AND ativo = 1
       AND data_validade >= CURDATE()
       AND (usos_maximos IS NULL OR usos_atuais < usos_maximos)`,
      [codigo.toUpperCase()],
    );

    const cupom = rows[0];

    if (!cupom) {
      return res.status(404).json({ error: 'Cupom inválido ou expirado' });
    }

    res.status(200).json({
      id: cupom.id,
      codigo: cupom.codigo,
      tipo: cupom.tipo,
      valor: cupom.valor,
    });
  } catch (error) {
    console.error('Erro ao validar cupom:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
