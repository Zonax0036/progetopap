import { ProductGrid } from '@/components/ProductGrid';
import { useRouter } from 'next/router';

export default function HomePage() {
  const router = useRouter();
  const { categoria, pesquisa } = router.query;

  return <ProductGrid categoriaId={categoria} pesquisa={pesquisa} />;
}
