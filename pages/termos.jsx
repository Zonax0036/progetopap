import Head from 'next/head';

export default function TermosDeUso() {
  return (
    <>
      <Head>
        <title>Termos de Uso - A Nossa Loja</title>
        <meta
          name="description"
          content="Leia os nossos Termos de Uso para compreender as regras e diretrizes de utilização do nosso website e serviços."
        />
      </Head>

      <div className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900">Termos de Uso</h1>
          </div>

          <div className="prose prose-lg mx-auto text-gray-600">
            <h2>1. Aceitação dos Termos</h2>
            <p>
              Ao aceder e utilizar o website A Nossa Loja, concorda em cumprir e ficar vinculado por
              estes Termos de Uso. Se não concordar com qualquer parte dos termos, não deverá
              utilizar o nosso website.
            </p>

            <h2>2. Utilização do Website</h2>
            <p>
              O utilizador concorda em usar este website apenas para fins legais e de uma forma que
              não infrinja os direitos de, restrinja ou iniba o uso e gozo deste website por
              qualquer terceiro.
            </p>

            <h2>3. Contas de Utilizador</h2>
            <p>
              Para aceder a certas funcionalidades, poderá ser necessário criar uma conta. O
              utilizador é responsável por manter a confidencialidade da sua palavra-passe e por
              todas as atividades que ocorram sob a sua conta.
            </p>

            <h2>4. Propriedade Intelectual</h2>
            <p>
              Todo o conteúdo presente neste website, incluindo textos, gráficos, logótipos e
              imagens, é propriedade da A Nossa Loja ou dos seus fornecedores de conteúdo e está
              protegido por leis de propriedade intelectual.
            </p>

            <h2>5. Limitação de Responsabilidade</h2>
            <p>
              A Nossa Loja não será responsável por quaisquer danos diretos, indiretos, incidentais,
              consequenciais ou punitivos resultantes do seu acesso ou uso do nosso website.
            </p>

            <h2>6. Alterações aos Termos</h2>
            <p>
              Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. As
              alterações entrarão em vigor imediatamente após a sua publicação no website.
            </p>

            <div className="mt-8 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
              <p>
                <strong>Aviso Importante:</strong> O conteúdo desta página é meramente
                exemplificativo e não possui validade legal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
