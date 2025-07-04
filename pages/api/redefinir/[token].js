import { pool } from '@/lib/conectarDB';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: 'Token is required' });
  }

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  if (req.method === 'GET') {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM usuarios WHERE passwordResetToken = ? AND passwordResetExpires > NOW()',
        [hashedToken],
      );

      const user = rows[0];

      if (!user) {
        return res.status(400).json({ message: 'Token inválido ou expirado.' });
      }

      res.status(200).json({ message: 'Token is valid' });
    } catch (error) {
      console.error('Error verifying token:', error);
      res.status(500).json({ message: 'An error occurred while verifying the token.' });
    }
  } else if (req.method === 'POST') {
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'A senha deve ter no mínimo 6 caracteres.' });
    }

    try {
      const [rows] = await pool.execute(
        'SELECT * FROM usuarios WHERE passwordResetToken = ? AND passwordResetExpires > NOW()',
        [hashedToken],
      );

      const user = rows[0];

      if (!user) {
        return res.status(400).json({ message: 'Token inválido ou expirado.' });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      await pool.execute(
        'UPDATE usuarios SET senha = ?, passwordResetToken = NULL, passwordResetExpires = NULL WHERE id = ?',
        [hashedPassword, user.id],
      );

      res.status(200).json({ message: 'Senha redefinida com sucesso.' });
    } catch (error) {
      console.error('Error resetting password:', error);
      res.status(500).json({ message: 'An error occurred while resetting the password.' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
