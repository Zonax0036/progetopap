import { getServerSession } from 'next-auth';

import { pool } from '@/lib/conectarDB';
import { authOptions } from '@/lib/auth';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user?.id) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  const userId = session.user.id;

  if (req.method === 'GET') {
    // Lógica para buscar pedidos (pode ser mais detalhada no futuro)
    try {
      const [pedidos] = await pool.execute(
        `SELECT
          p.id,
          p.total,
          p.status,
          p.data_criacao,
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'produto_id', pi.produto_id,
              'nome_produto', prod.nome,
              'quantidade', pi.quantidade,
              'preco_unitario', pi.preco_unitario
            )
          ) as itens
        FROM pedidos p
        JOIN pedido_itens pi ON p.id = pi.pedido_id
        JOIN produtos prod ON pi.produto_id = prod.id
        WHERE p.user_id = ?
        GROUP BY p.id
        ORDER BY p.data_criacao DESC`,
        [userId],
      );
      return res.status(200).json(pedidos);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      return res.status(500).json({ error: 'Erro ao buscar pedidos' });
    }
  } else if (req.method === 'POST') {
    const {
      carrinho,
      enderecoId,
      cupom, // Agora recebemos o objeto do cupom
      subtotal,
      valorDesconto,
      valorEntrega,
      total,
      metodoPagamento,
    } = req.body;

    // Validação dos dados recebidos
    if (
      !carrinho ||
      carrinho.length === 0 ||
      !enderecoId ||
      subtotal === undefined ||
      valorDesconto === undefined ||
      valorEntrega === undefined ||
      total === undefined ||
      !metodoPagamento
    ) {
      return res.status(400).json({ error: 'Dados do pedido incompletos ou inválidos.' });
    }

    let connection;
    try {
      connection = await pool.getConnection();
      await connection.beginTransaction();

      // 1. Inserir o pedido na tabela `pedidos`
      const [pedidoResult] = await connection.execute(
        `INSERT INTO pedidos (user_id, morada_id, cupom_id, subtotal, valor_desconto, valor_entrega, total, metodo_pagamento, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          enderecoId,
          cupom ? cupom.id : null,
          subtotal,
          valorDesconto,
          valorEntrega,
          total,
          metodoPagamento,
          'Processando', // Novo status inicial
        ],
      );
      const pedidoId = pedidoResult.insertId;

      // 2. Inserir os itens do pedido na tabela `pedido_itens`
      const itensValues = carrinho.map(item => [pedidoId, item.id, item.quantidade, item.preco]);
      await connection.query(
        'INSERT INTO pedido_itens (pedido_id, produto_id, quantidade, preco_unitario) VALUES ?',
        [itensValues],
      );

      // 3. Atualizar o estoque dos produtos
      for (const item of carrinho) {
        await connection.execute('UPDATE produtos SET estoque = estoque - ? WHERE id = ?', [
          item.quantidade,
          item.id,
        ]);
      }

      // 4. Se um cupom foi usado, atualizar seu contador de usos
      if (cupom && cupom.id) {
        await connection.execute('UPDATE cupons SET usos_atuais = usos_atuais + 1 WHERE id = ?', [
          cupom.id,
        ]);
      }

      // Se tudo correu bem, cometer a transação
      await connection.commit();

      return res.status(201).json({
        message: 'Pedido criado com sucesso!',
        pedidoId,
      });
    } catch (error) {
      // Em caso de erro, reverter a transação
      if (connection) {
        await connection.rollback();
      }
      console.error('Erro ao criar pedido:', error);
      // Verificar se é um erro de estoque
      if (error.code === 'ER_CHECK_CONSTRAINT_VIOLATED') {
        return res
          .status(400)
          .json({ error: 'Um ou mais produtos no carrinho não têm estoque suficiente.' });
      }
      return res
        .status(500)
        .json({ error: 'Ocorreu um erro no servidor ao processar seu pedido.' });
    } finally {
      if (connection) {
        connection.release();
      }
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Método ${req.method} não permitido`);
  }
}
