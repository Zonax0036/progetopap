import Head from 'next/head';
import LayoutPublic from '@/components/LayoutPublic';

export default function Legal() {
  return (
    <LayoutPublic>
      <Head>
        <title>Informações Legais - A Nossa Loja</title>
        <meta
          name="description"
          content="Consulte as informações legais da nossa empresa, incluindo detalhes de registo e conformidade."
        />
      </Head>

      <div className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900">Informações Legais</h1>
          </div>

          <div className="prose prose-lg mx-auto text-gray-600">
            <h2>Identificação da Empresa</h2>
            <p>
              <strong>Nome da Empresa:</strong> A Nossa Loja, Lda.
              <br />
              <strong>NIF:</strong> 500 000 000
              <br />
              <strong>Sede Social:</strong> Rua das Inovações, 123, 1000-001 Lisboa, Portugal
              <br />
              <strong>Email:</strong> legal@anossaloja.pt
            </p>

            <h2>Objeto</h2>
            <p>
              A Nossa Loja dedica-se ao comércio a retalho de uma vasta gama de produtos,
              disponibilizados através da nossa plataforma online.
            </p>

            <h2>Registo</h2>
            <p>
              A empresa encontra-se devidamente registada na Conservatória do Registo Comercial de
              Lisboa.
            </p>

            <h2>Resolução Alternativa de Litígios de Consumo</h2>
            <p>
              Em caso de litígio, o consumidor pode recorrer a uma Entidade de Resolução Alternativa
              de Litígios de Consumo. Pode consultar a lista de entidades em{' '}
              <a
                href="https://www.consumidor.gov.pt"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                www.consumidor.gov.pt
              </a>
              .
            </p>

            <div className="mt-8 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
              <p>
                <strong>Aviso Importante:</strong> O conteúdo desta página é meramente
                exemplificativo e não possui validade legal. Para a sua empresa, deverá consultar um
                profissional jurídico para redigir os textos legais adequados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </LayoutPublic>
  );
}
