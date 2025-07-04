import { pool } from '@/lib/conectarDB';

export default async function handler(req, res) {
  const { param } = req.query;

  if (req.method === 'GET') {
    try {
      const [rows] = await pool.execute(
        `SELECT * FROM cupons
         WHERE codigo = ?
         AND ativo = 1
         AND data_validade >= CURDATE()
         AND (usos_maximos IS NULL OR usos_atuais < usos_maximos)`,
        [param.toUpperCase()],
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
  } else if (req.method === 'PUT') {
    try {
      const { codigo, tipo, valor, data_validade, usos_maximos, ativo } = req.body;

      if (!codigo || !tipo || !valor || !data_validade) {
        return res
          .status(400)
          .json({ error: 'Todos os campos obrigatórios devem ser preenchidos.' });
      }

      await pool.execute(
        'UPDATE cupons SET codigo = ?, tipo = ?, valor = ?, data_validade = ?, usos_maximos = ?, ativo = ? WHERE id = ?',
        [codigo, tipo, valor, data_validade, usos_maximos, ativo, param],
      );

      const [updatedCupom] = await pool.query('SELECT * FROM cupons WHERE id = ?', [param]);

      return res.status(200).json(updatedCupom[0]);
    } catch (error) {
      console.error(`Erro ao atualizar o cupom ${param}:`, error);
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Já existe um cupom com este código.' });
      }
      return res.status(500).json({ error: 'Erro ao atualizar o cupom' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const [result] = await pool.execute('DELETE FROM cupons WHERE id = ?', [param]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Cupom não encontrado.' });
      }

      return res.status(204).end();
    } catch (error) {
      console.error(`Erro ao deletar o cupom ${param}:`, error);
      return res.status(500).json({ error: 'Erro ao deletar o cupom' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Método ${req.method} não permitido`);
  }
}
