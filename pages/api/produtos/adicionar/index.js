import { getServerSession } from 'next-auth/next';

import conectarDB from '@/lib/conectarDB';
import { authOptions } from '@/lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ erro: 'Método não permitido' });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ erro: 'Não autenticado' });
  }

  const { nome, descricao = '', preco, imagem = '', categoria } = req.body;

  // Validação básica
  if (!nome || !preco || !categoria) {
    return res.status(400).json({ erro: 'Campos obrigatórios não preenchidos' });
  }

  try {
    const connection = await conectarDB();
    const query = `
      INSERT INTO produtos (nome, descricao, preco, imagem, categoria_id)
      VALUES (?, ?, ?, ?, ?)
    `;

    await connection.execute(query, [nome, descricao, preco, imagem, categoria]);
    await connection.end();

    return res.status(200).json({ mensagem: 'Produto adicionado com sucesso' });
  } catch (error) {
    console.error('Erro ao adicionar produto:', error);
    return res.status(500).json({ erro: 'Erro no servidor' });
  }
}
