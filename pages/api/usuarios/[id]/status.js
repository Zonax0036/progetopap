import { pool } from '../../../../lib/conectarDB';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/auth';

export default async function handler(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ erro: 'Não autenticado' });
    }

    if (!session.user.isAdmin) {
      return res.status(403).json({ erro: 'Não autorizado' });
    }

    const { id } = req.query;

    if (req.method === 'PATCH') {
      const { ativo } = req.body;

      if (typeof ativo !== 'boolean') {
        return res.status(400).json({ erro: 'Status inválido. Esperado um booleano.' });
      }

      const usuarioId = parseInt(id);
      if (isNaN(usuarioId)) {
        return res.status(400).json({ erro: 'ID de usuário inválido' });
      }

      // Verifica se o usuário existe
      const [usuarios] = await pool.execute('SELECT * FROM usuarios WHERE id = ?', [usuarioId]);
      const usuario = usuarios[0];

      if (!usuario) {
        return res.status(404).json({ erro: 'Usuário não encontrado' });
      }

      // Não permite desativar o próprio admin logado
      if (usuario.email === session.user.email && !ativo) {
        return res.status(400).json({ erro: 'Não é possível desativar seu próprio usuário' });
      }

      await pool.execute('UPDATE usuarios SET ativo = ? WHERE id = ?', [ativo, usuarioId]);

      return res.status(200).json({
        mensagem: 'Status atualizado com sucesso',
        ativo,
      });
    }

    return res.status(405).json({ erro: 'Método não permitido' });
  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}
