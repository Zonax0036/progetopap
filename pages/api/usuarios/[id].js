import { conectarDB } from '../../../lib/conectarDB';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';

export default async function handler(req, res) {
  try {
    // Verifica se o usuário está autenticado e é admin
    const session = await getServerSession(req, res, authOptions);
    
    if (!session) {
      return res.status(401).json({ erro: 'Não autenticado' });
    }
    
    // Verifique se o usuário tem a propriedade isAdmin
    if (!session.user.isAdmin) {
      return res.status(401).json({ erro: 'Não autorizado' });
    }

    const { id } = req.query;
    
    if (req.method === 'DELETE') {
      // Verifica se o ID é válido
      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({ erro: 'ID de usuário inválido' });
      }
      
      const connection = await conectarDB();
      
      // Verifica se o usuário existe e não é o próprio admin
      const [usuarios] = await connection.execute(
        'SELECT * FROM usuarios WHERE id = ?',
        [id]
      );
      
      const usuario = usuarios[0];
      if (!usuario) {
        await connection.end();
        return res.status(404).json({ erro: 'Usuário não encontrado' });
      }
      
      // Não permite excluir o próprio usuário admin
      if (usuario.email === session.user.email) {
        await connection.end();
        return res.status(400).json({ erro: 'Não é possível excluir seu próprio usuário' });
      }
      
      // Excluir o usuário
      await connection.execute('DELETE FROM usuarios WHERE id = ?', [id]);
      
      await connection.end();
      
      return res.status(200).json({ 
        mensagem: 'Usuário excluído com sucesso',
        id
      });
    }
    
    return res.status(405).json({ erro: 'Método não permitido' });
  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}
