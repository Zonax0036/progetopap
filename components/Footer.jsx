import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-8 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Coluna 1: Navegação */}
          <div>
            <h3 className="text-lg font-bold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-blue-300">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/produtos" className="hover:text-blue-300">
                  Produtos
                </Link>
              </li>
              <li>
                <a href="/sobre" className="hover:text-blue-300">
                  Sobre Nós
                </a>
              </li>
              <li>
                <a href="/contacto" className="hover:text-blue-300">
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          {/* Coluna 2: Contacto */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contacto</h3>
            <address className="not-italic">
              <p>Email: info@sportshop.com</p>
              <p>Morada: Av. do Esporte, 123</p>
            </address>
          </div>

          {/* Coluna 3: Legal */}
          <div>
            <h3 className="text-lg font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="/termos" className="hover:text-blue-300">
                  Termos de Uso
                </a>
              </li>
              <li>
                <a href="/privacidade" className="hover:text-blue-300">
                  Política de Privacidade
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p>&copy; {new Date().getFullYear()} SportShop. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
