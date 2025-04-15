// pages/_app.js
import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import { CarrinhoProvider } from '../context/CarrinhoContext';

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider>
      <CarrinhoProvider>
        <Component {...pageProps} />
      </CarrinhoProvider>
    </SessionProvider>
  );
}

export default MyApp
