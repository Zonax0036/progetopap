import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { pool } from '@/lib/conectarDB';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',

      credentials: {
        email: { label: 'Email', type: 'text' },
        senha: { label: 'Senha', type: 'password' },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.senha) {
          return null;
        }

        try {
          console.log('Autorizando para:', credentials.email);
          const [rows] = await pool.execute(
            'SELECT * FROM usuarios WHERE email = ? AND ativo = 1 LIMIT 1',
            [credentials.email],
          );

          const user = rows[0];

          if (!user) {
            console.log('Usuário não encontrado:', credentials.email);
            return null;
          }

          console.log('Usuário encontrado:', user.email);
          console.log('Senha recebida:', credentials.senha);
          console.log('Hash no banco:', user.senha);

          const senhaConfere = await bcrypt.compare(credentials.senha, user.senha);

          console.log('Resultado da comparação:', senhaConfere);

          if (!senhaConfere) {
            console.log('A senha não confere.');
            return null;
          }

          console.log('Autorização bem-sucedida para:', user.email);

          // Retorna dados do usuário sem a senha
          return {
            id: user.id,
            name: user.nome,
            email: user.email,
            role: user.role,
            isAdmin: user.role === 'admin',
          };
        } catch (error) {
          console.error('Erro na autorização: ', error);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.isAdmin = user.isAdmin;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.isAdmin = token.isAdmin;
      }
      return session;
    },
  },

  pages: {
    signIn: '/login',
  },

  secret: process.env.NEXTAUTH_SECRET,
};
