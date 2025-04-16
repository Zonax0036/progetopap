import LayoutPublic from './LayoutPublic';
import { CarrinhoProvider } from '@/context/CarrinhoContext';

export default function LayoutUser({ children }) {
  return (
    <LayoutPublic>
      <CarrinhoProvider>{children}</CarrinhoProvider>
    </LayoutPublic>
  );
}
