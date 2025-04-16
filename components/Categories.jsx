import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCategorias } from '@/lib/hooks/useCategories';

export default function CategoriaMenu() {
  const router = useRouter();
  const { categorias, loading } = useCategorias();

  const isAtiva = nome => router.query.categoria === nome;

  return (
    <div className="bg-gray-100 shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex overflow-x-auto py-3 scrollbar-hide space-x-2">
          <Link href="/" legacyBehavior>
            <a
              className={`category-btn ${!router.query.categoria ? 'bg-blue-600 text-white' : ''}`}
            >
              Todos
            </a>
          </Link>

          {!loading &&
            categorias.map(cat => (
              <Link key={cat.id} href={`/produtos?categoria=${cat.nome}`} legacyBehavior>
                <a className={`category-btn ${isAtiva(cat.nome) ? 'bg-blue-600 text-white' : ''}`}>
                  {cat.nome}
                </a>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
