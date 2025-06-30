// lib/conectarDB.js
import mysql from 'mysql2/promise';

let pool;

try {
  pool = mysql.createPool({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'root',
    database: process.env.MYSQL_DATABASE || 'loja_desportiva',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4',
  });

  console.log('Pool de conexões criado com sucesso.');
} catch (error) {
  console.error('Erro ao criar o pool de conexões com o banco de dados:', error);
}

export { pool };
