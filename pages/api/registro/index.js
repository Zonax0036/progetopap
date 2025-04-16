import conectarDB from '@/lib/conectarDB';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
  }

  let connection;

  try {
    connection = await conectarDB();

    // Verifica se o email já está cadastrado
    const [existingUser] = await connection.execute('SELECT 1 FROM usuarios WHERE email = ?', [
      email,
    ]);

    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Este email já está cadastrado!' });
    }

    // Hash da senha
    const hashedSenha = await bcrypt.hash(senha, 10);

    // Criação do usuário
    await connection.execute(
      'INSERT INTO usuarios (nome, email, senha, role) VALUES (?, ?, ?, ?)',
      [nome, email, hashedSenha, 'user'],
    );

    return res.status(201).json({ message: 'Usuário criado com sucesso!' });
  } catch (error) {
    console.error('Erro no servidor:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
