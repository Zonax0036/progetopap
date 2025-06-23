import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCategorias } from '@/lib/hooks/useCategories';

export default function CategoriaMenu() {
  // Acessa o objeto router do Next.js para informações sobre a rota atual
  const router = useRouter();
  
  // Utiliza um hook personalizado para obter as categorias e estado de carregamento
  const { categorias, loading } = useCategorias();

  // Função para verificar se uma categoria está ativa com base na URL atual
  const isAtiva = nome => router.query.categoria === nome;

  return (
    <div className="bg-gray-100 shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        {/* Container com rolagem horizontal para categorias */}
        <div className="flex overflow-x-auto py-3 scrollbar-hide space-x-2">
          {/* Link para a página inicial (Todos os produtos) */}
          <Link href="/" legacyBehavior>
            <a
              className={`category-btn ${!router.query.categoria ? 'bg-blue-600 text-white' : ''}`}
            >
              Todos
            </a>
          </Link>

          {/* Renderiza links para cada categoria disponível (se não estiver carregando) */}
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
