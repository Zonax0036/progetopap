// pages/api/usuarios/index.js
import { pool } from '../../../lib/conectarDB';
import bcrypt from 'bcryptjs';

async function getHandler(req, res) {
  try {
    const [usuarios] = await pool.execute(
      'SELECT id, nome, email, data_criacao, ativo, role FROM usuarios',
    );

    const usuariosFormatados = usuarios.map(usuario => ({
      id: usuario.id.toString(),
      nome: usuario.nome || 'N/A',
      email: usuario.email,
      dataCriacao: usuario.data_criacao || new Date().toISOString(),
      ativo: usuario.ativo === 1,
      role: usuario.role || 'user',
    }));

    return res.status(200).json(usuariosFormatados);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return res.status(500).json({ erro: 'Erro ao buscar usuários: ' + error.message });
  }
}

async function postHandler(req, res) {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Todos os campos são obrigatórios!' });
  }

  try {
    const [existingUser] = await pool.execute('SELECT 1 FROM usuarios WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ erro: 'Este email já está cadastrado!' });
    }

    const hashedSenha = await bcrypt.hash(senha, 10);

    await pool.execute('INSERT INTO usuarios (nome, email, senha, role) VALUES (?, ?, ?, ?)', [
      nome,
      email,
      hashedSenha,
      'user',
    ]);

    return res.status(201).json({ message: 'Usuário criado com sucesso!' });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
}

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      return getHandler(req, res);
    case 'POST':
      return postHandler(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ erro: `Método ${req.method} não permitido` });
  }
}
