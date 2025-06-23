import { conectarDB } from '../../../../lib/conectarDB';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../api/auth/[...nextauth]';
import { ObjectId } from 'mongodb';

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
    
    if (req.method === 'PATCH') {
      const { ativo } = req.body;
      
      if (typeof ativo !== 'boolean') {
        return res.status(400).json({ erro: 'Status inválido' });
      }
      
      // Verifica se o ID é válido
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ erro: 'ID de usuário inválido' });
      }
      
      const db = await conectarDB();
      
      // Verifica se o usuário existe antes de atualizar
      const usuario = await db.collection('usuarios').findOne({ _id: new ObjectId(id) });
      if (!usuario) {
        return res.status(404).json({ erro: 'Usuário não encontrado' });
      }
      
      // Não permite desativar o próprio usuário admin
      if (usuario.email === session.user.email && !ativo) {
        return res.status(400).json({ erro: 'Não é possível desativar seu próprio usuário' });
      }
      
      const resultado = await db.collection('usuarios').updateOne(
        { _id: new ObjectId(id) },
        { $set: { ativo } }
      );
      
      return res.status(200).json({ 
        mensagem: 'Status atualizado com sucesso',
        ativo
      });
    }
    
    return res.status(405).json({ erro: 'Método não permitido' });
  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}
