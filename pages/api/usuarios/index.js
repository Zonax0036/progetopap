// pages/api/usuarios/index.js
import conectarDB from '../../../lib/conectarDB';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Obter conexão MySQL
      const connection = await conectarDB();
      
      // Consulta SQL para buscar usuários
      const [usuarios] = await connection.execute('SELECT * FROM usuarios');
      
      // Formata os dados para o frontend
      const usuariosFormatados = usuarios.map(usuario => ({
        id: usuario.id.toString(),
        nome: usuario.nome || 'N/A',
        email: usuario.email,
        dataCriacao: usuario.data_criacao || new Date().toISOString(),
        ativo: usuario.ativo === 1, // Converte 1/0 para true/false
      }));
      
      return res.status(200).json(usuariosFormatados);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      return res.status(500).json({ erro: 'Erro ao buscar usuários: ' + error.message });
    }
  }
  
  return res.status(405).json({ erro: 'Método não permitido' });
}
