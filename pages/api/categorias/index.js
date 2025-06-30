import { pool } from '@/lib/conectarDB';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const [rows] = await pool.execute('SELECT id, nome, data_criacao FROM categorias');
    res.status(200).json(rows); // retorna array de objetos { id, nome }
  } catch (error) {
    console.error('Erro no handler de categorias:', error);
    res.status(500).json({ error: 'Erro ao buscar categorias' });
  }
}
