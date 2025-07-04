import Head from 'next/head';

export default function SobreNos() {
  return (
    <>
      <Head>
        <title>Sobre Nós - A Nossa Loja</title>
        <meta
          name="description"
          content="Saiba mais sobre a nossa história, a nossa missão e os valores que nos movem. Conheça a equipa por trás da A Nossa Loja."
        />
      </Head>

      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">A Nossa História</h1>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Uma jornada de paixão, inovação e compromisso com a qualidade.
            </p>
          </div>

          <div className="mt-20">
            <div className="space-y-16">
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2">
                  <h2 className="text-3xl font-bold text-gray-900">A Nossa Missão</h2>
                  <p className="mt-4 text-lg text-gray-600">
                    A nossa missão é simples: oferecer os melhores produtos, com a máxima qualidade
                    e um serviço de excelência. Acreditamos que cada cliente é único e merece uma
                    experiência de compra inesquecível. Trabalhamos todos os dias para superar as
                    expectativas e construir relações de confiança duradouras.
                  </p>
                </div>
                <div className="md:w-1/2 mt-8 md:mt-0 md:ml-12">
                  <img
                    className="rounded-lg shadow-xl"
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                    alt="Equipa a colaborar"
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row-reverse items-center">
                <div className="md:w-1/2">
                  <h2 className="text-3xl font-bold text-gray-900">Os Nossos Valores</h2>
                  <p className="mt-4 text-lg text-gray-600">
                    <strong>Qualidade:</strong> Selecionamos rigorosamente os nossos produtos e
                    fornecedores para garantir a máxima qualidade.
                    <br />
                    <strong>Inovação:</strong> Estamos constantemente à procura de novas tendências
                    e tecnologias para lhe oferecer o melhor do mercado.
                    <br />
                    <strong>Cliente em Primeiro Lugar:</strong> A sua satisfação é a nossa
                    prioridade. A nossa equipa está sempre disponível para ajudar.
                    <br />
                    <strong>Sustentabilidade:</strong> Comprometemo-nos com práticas comerciais
                    responsáveis e amigas do ambiente.
                  </p>
                </div>
                <div className="md:w-1/2 mt-8 md:mt-0 md:mr-12">
                  <img
                    className="rounded-lg shadow-xl"
                    src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                    alt="Valores da empresa"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-20 text-center">
            <h2 className="text-3xl font-bold text-gray-900">Junte-se a Nós</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
              Faça parte da nossa comunidade e descubra um mundo de produtos incríveis. Estamos
              ansiosos por tê-lo connosco!
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
