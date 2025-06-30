import { pool } from '../../../lib/conectarDB';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/auth';

async function getHandler(req, res, id) {
  try {
    const [rows] = await pool.execute('SELECT id, nome, email, role FROM usuarios WHERE id = ?', [
      id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }
    const usuario = rows[0];
    res.status(200).json({
      ...usuario,
      data_nascimento: usuario.data_nascimento
        ? new Date(usuario.data_nascimento).toISOString().split('T')[0]
        : null,
    });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}

async function putHandler(req, res, id) {
  const { nome, email, role } = req.body;

  try {
    await pool.execute('UPDATE usuarios SET nome = ?, email = ?, role = ? WHERE id = ?', [
      nome,
      email,
      role,
      id,
    ]);
    res.status(200).json({ mensagem: 'Usuário atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}

async function deleteHandler(req, res, id, session) {
  try {
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ erro: 'ID de usuário inválido' });
    }

    const [usuarios] = await pool.execute('SELECT * FROM usuarios WHERE id = ?', [id]);
    const usuario = usuarios[0];

    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    if (usuario.email === session.user.email) {
      return res.status(400).json({ erro: 'Não é possível excluir seu próprio usuário' });
    }

    await pool.execute('DELETE FROM usuarios WHERE id = ?', [id]);
    return res.status(200).json({ mensagem: 'Usuário excluído com sucesso', id });
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}

export default async function handler(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user.isAdmin) {
      return res.status(401).json({ erro: 'Não autorizado' });
    }

    const { id } = req.query;

    switch (req.method) {
      case 'GET':
        return getHandler(req, res, id);
      case 'PUT':
        return putHandler(req, res, id);
      case 'DELETE':
        return deleteHandler(req, res, id, session);
      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).json({ erro: `Método ${req.method} não permitido` });
    }
  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}
