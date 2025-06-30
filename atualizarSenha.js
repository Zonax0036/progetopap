import bcrypt from 'bcryptjs';
import { pool } from './lib/conectarDB.js';

async function atualizarSenha() {
  // IMPORTANTE: Substitua o email e a senha pelos valores desejados.
  const email = 'admin@example.com';
  const novaSenha = '1234';

  try {
    console.log(`Iniciando atualização de senha para: ${email}`);
    const hashedSenha = await bcrypt.hash(novaSenha, 10);
    console.log(`Nova hash gerada: ${hashedSenha}`);

    const [result] = await pool.execute('UPDATE usuarios SET senha = ? WHERE email = ?', [
      hashedSenha,
      email,
    ]);

    if (result.affectedRows > 0) {
      console.log('Senha atualizada com sucesso!');
    } else {
      console.log('Usuário não encontrado. Nenhuma senha foi alterada.');
    }
  } catch (error) {
    console.error('Erro ao atualizar a senha:', error);
  } finally {
    await pool.end();
    console.log('Conexão com o banco de dados fechada.');
  }
}

atualizarSenha();
