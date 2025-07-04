import { useSession } from 'next-auth/react';
import { ProductCard } from '../components/ProductCard';
import { LoadingSpinner } from '../components/Loading';
import { useFavoritos } from '@/context/FavoritosContext';

export default function FavoritosPage() {
  const { data: session, status } = useSession();
  const { favoritos } = useFavoritos();

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  if (!session) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold">Favoritos</h1>
        <p className="mt-4">Por favor, faça login para ver a sua lista de favoritos.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Minha Lista de Favoritos</h1>
      {favoritos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favoritos.map(produto => produto && <ProductCard key={produto.id} produto={produto} />)}
        </div>
      ) : (
        <p>A sua lista de favoritos está vazia.</p>
      )}
    </div>
  );
}
