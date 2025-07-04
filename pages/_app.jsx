// pages/_app.jsx
import { SessionProvider, useSession } from 'next-auth/react';
import LayoutPublic from '@/components/LayoutPublic';
import LayoutUser from '@/components/LayoutUser';
import AdminLayout from '@/components/admin/AdminLayout';
import '@/styles/globals.css';
import { CarrinhoProvider } from '@/context/CarrinhoContext';
import { FavoritosProvider } from '@/context/FavoritosContext';
import { Toaster } from 'sonner';

function LayoutWrapper({ Component, pageProps }) {
  const { data: session, status } = useSession();

  const getLayout =
    Component.getLayout ||
    (page => {
      if (status === 'loading') {
        return <p>Carregando sessão...</p>;
      }

      const role = session?.user?.role;

      if (role === 'admin') {
        return <AdminLayout>{page}</AdminLayout>;
      }

      if (role === 'user') {
        return <LayoutUser>{page}</LayoutUser>;
      }

      return <LayoutPublic>{page}</LayoutPublic>;
    });

  return getLayout(<Component {...pageProps} />);
}

export default function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <CarrinhoProvider>
        <FavoritosProvider>
          <LayoutWrapper Component={Component} pageProps={pageProps} />
          <Toaster richColors />
        </FavoritosProvider>
      </CarrinhoProvider>
    </SessionProvider>
  );
}
