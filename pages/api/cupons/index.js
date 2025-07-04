import { pool } from '@/lib/conectarDB';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const [cupons] = await pool.query('SELECT * FROM cupons ORDER BY data_validade DESC');
      return res.status(200).json(cupons);
    } catch (error) {
      console.error('Erro ao buscar cupons:', error);
      return res.status(500).json({ error: 'Erro ao buscar cupons' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { codigo, tipo, valor, data_validade, usos_maximos, ativo } = req.body;

      if (!codigo || !tipo || !valor || !data_validade) {
        return res
          .status(400)
          .json({ error: 'Todos os campos obrigatórios devem ser preenchidos.' });
      }

      const [result] = await pool.execute(
        'INSERT INTO cupons (codigo, tipo, valor, data_validade, usos_maximos, ativo) VALUES (?, ?, ?, ?, ?, ?)',
        [codigo, tipo, valor, data_validade, usos_maximos, ativo],
      );

      const [newCupom] = await pool.query('SELECT * FROM cupons WHERE id = ?', [result.insertId]);

      return res.status(201).json(newCupom[0]);
    } catch (error) {
      console.error('Erro ao criar cupom:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Já existe um cupom com este código.' });
      }
      return res.status(500).json({ error: 'Erro ao criar cupom' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Método ${req.method} não permitido`);
}
