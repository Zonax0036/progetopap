// lib/conectarDB.js
import mysql from 'mysql2/promise';

export default async function conectarDB() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || 'root',
      database: process.env.MYSQL_DATABASE || 'loja_desportiva',
      charset: 'utf8mb4',
    });

    return connection;
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
    return null;
  }
}
