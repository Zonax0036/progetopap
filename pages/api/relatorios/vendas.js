import { pool } from '@/lib/conectarDB';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const [rows] = await pool.query(`
        SELECT
          DATE(data_criacao) as dia,
          COUNT(id) as total_pedidos,
          SUM(total) as faturamento_total,
          AVG(total) as ticket_medio,
          SUM(CASE WHEN status = 'pago' THEN 1 ELSE 0 END) as pedidos_pagos,
          SUM(CASE WHEN status = 'pendente' THEN 1 ELSE 0 END) as pedidos_pendentes,
          SUM(CASE WHEN status = 'enviado' THEN 1 ELSE 0 END) as pedidos_enviados,
          SUM(CASE WHEN status = 'cancelado' THEN 1 ELSE 0 END) as pedidos_cancelados
        FROM pedidos
        GROUP BY DATE(data_criacao)
        ORDER BY dia DESC;
      `);

      res.status(200).json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao buscar relatório de vendas.' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Método ${req.method} não permitido.`);
  }
}
