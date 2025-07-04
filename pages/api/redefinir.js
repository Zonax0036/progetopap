import { pool } from '@/lib/conectarDB';
import crypto from 'crypto';
// This is a placeholder for an email sending service
// import { sendPasswordResetEmail } from '@/lib/email';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const [rows] = await pool.execute(
      'SELECT * FROM usuarios WHERE email = ? AND ativo = 1 LIMIT 1',
      [email],
    );

    const user = rows[0];

    if (!user) {
      // To prevent email enumeration, we send a success response even if the user doesn't exist.
      console.log(`Password reset requested for non-existent user: ${email}`);
      return res.status(200).json({
        message: 'If a user with that email exists, a password reset link has been sent.',
      });
    }

    // Generate a password reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    const passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour from now

    await pool.execute(
      'UPDATE usuarios SET passwordResetToken = ?, passwordResetExpires = ? WHERE id = ?',
      [passwordResetToken, passwordResetExpires, user.id],
    );

    // TODO: Implement email sending
    // For now, we'll just log the token to the console.
    // In a real application, you would send an email with a link like:
    // const resetUrl = `${process.env.NEXTAUTH_URL}/redefinir/${resetToken}`;
    // await sendPasswordResetEmail(user.email, resetUrl);

    console.log(`Password reset token for ${email}: ${resetToken}`);

    res
      .status(200)
      .json({ message: 'If a user with that email exists, a password reset link has been sent.' });
  } catch (error) {
    console.error('Error during password reset request:', error);
    res.status(500).json({ message: 'An error occurred while processing your request.' });
  }
}
