import conectarDB from '@/lib/conectarDB';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const connection = await conectarDB();

    if (!connection) {
      return res.status(500).json({ error: 'Falha ao conectar ao banco de dados.' });
    }

    const [rows] = await connection.execute('SELECT id, nome FROM categorias');

    await connection.end();

    res.status(200).json(rows); // retorna array de objetos { id, nome }
  } catch (error) {
    console.error('Erro no handler de categorias:', error);
    res.status(500).json({ error: 'Erro ao buscar categorias' });
  }
}
