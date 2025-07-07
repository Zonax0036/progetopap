import { pool } from '@/lib/conectarDB';
import bcrypt from 'bcryptjs';
import { Resend } from 'resend';
import BoasVindasEmail from '@/emails/BoasVindasEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
  }

  try {
    // Verifica se o email já está cadastrado
    const [existingUser] = await pool.execute('SELECT 1 FROM usuarios WHERE email = ?', [email]);

    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Este email já está cadastrado!' });
    }

    // Hash da senha
    const hashedSenha = await bcrypt.hash(senha, 10);

    // Criação do usuário
    await pool.execute('INSERT INTO usuarios (nome, email, senha, role) VALUES (?, ?, ?, ?)', [
      nome,
      email,
      hashedSenha,
      'user',
    ]);

    const [newUserRows] = await pool.execute('SELECT * FROM usuarios WHERE email = ?', [email]);
    const newUser = newUserRows[0];
    const emailParaBoasVindas = newUser.email_fatura || newUser.email;

    try {
      await resend.emails.send({
        from: 'Loja Desportiva <onboarding@resend.dev>',
        to: [emailParaBoasVindas],
        subject: 'Bem-vindo à Loja Desportiva!',
        react: <BoasVindasEmail nomeUtilizador={nome} />,
      });
    } catch (error) {
      console.error('Erro ao enviar email de boas-vindas:', error);
      // Mesmo que o email falhe, o usuário foi criado.
      // Pode-se adicionar um logging mais robusto aqui.
    }

    return res.status(201).json({ message: 'Usuário criado com sucesso!' });
  } catch (error) {
    console.error('Erro no servidor:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
}
