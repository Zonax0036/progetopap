import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import conectarDB from '@/lib/conectarDB';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',

      credentials: {
        email: { label: 'Email', type: 'text' },
        senha: { label: 'Senha', type: 'password' },
      },

      async authorize(credentials) {
        const connection = await conectarDB();

        try {
          const [rows] = await connection.execute(
            'SELECT * FROM usuarios WHERE email = ? LIMIT 1',
            [credentials.email],
          );

          const user = rows[0];

          if (!user) {
            return null;
          }

          const senhaConfere = await bcrypt.compare(credentials.senha, user.senha);

          if (!senhaConfere) {
            return null;
          }

          // Retorna dados do usuário sem a senha
          return {
            id: user.id,
            name: user.nome,
            email: user.email,
            role: user.role,
          };
        } finally {
          await connection.end();
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
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },

  pages: {
    signIn: '/login',
  },

  secret: process.env.NEXTAUTH_SECRET,
};
