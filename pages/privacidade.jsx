import Head from 'next/head';

export default function PoliticaDePrivacidade() {
  return (
    <>
      <Head>
        <title>Política de Privacidade - A Nossa Loja</title>
        <meta
          name="description"
          content="Conheça a nossa Política de Privacidade e saiba como recolhemos, utilizamos e protegemos os seus dados pessoais."
        />
      </Head>

      <div className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900">Política de Privacidade</h1>
          </div>

          <div className="prose prose-lg mx-auto text-gray-600">
            <h2>1. Recolha de Informação</h2>
            <p>
              Recolhemos informações pessoais quando se regista no nosso site, faz uma encomenda,
              subscreve a nossa newsletter ou preenche um formulário. As informações recolhidas
              podem incluir o seu nome, endereço de email, morada e número de telefone.
            </p>

            <h2>2. Utilização da Informação</h2>
            <p>A informação que recolhemos pode ser utilizada para:</p>
            <ul>
              <li>Personalizar a sua experiência e responder às suas necessidades individuais.</li>
              <li>Melhorar o nosso website e o nosso serviço ao cliente.</li>
              <li>
                Processar transações e enviar informações e atualizações sobre a sua encomenda.
              </li>
              <li>Administrar um concurso, promoção, inquérito ou outra funcionalidade do site.</li>
            </ul>

            <h2>3. Proteção da Informação</h2>
            <p>
              Implementamos uma variedade de medidas de segurança para manter a segurança das suas
              informações pessoais.
            </p>

            <h2>4. Cookies</h2>
            <p>
              Utilizamos cookies para nos ajudar a lembrar e processar os itens no seu carrinho de
              compras, compreender e guardar as suas preferências para futuras visitas e compilar
              dados agregados sobre o tráfego do site.
            </p>

            <h2>5. Divulgação a Terceiros</h2>
            <p>
              Não vendemos, trocamos ou transferimos para terceiros as suas informações pessoalmente
              identificáveis. Isto não inclui terceiros de confiança que nos ajudam a operar o nosso
              website ou a conduzir o nosso negócio, desde que essas partes concordem em manter esta
              informação confidencial.
            </p>

            <h2>6. Consentimento</h2>
            <p>Ao utilizar o nosso site, concorda com a nossa política de privacidade.</p>

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
