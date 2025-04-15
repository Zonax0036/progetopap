// lib/conectarDB.js
import mysql from 'mysql2/promise';

export default async function conectarDB() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'loja_desportiva'
    });
    
    return connection;
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
    return null;
  }
}
