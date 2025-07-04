import { useState } from 'react';
import Head from 'next/head';

export default function Contacto() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    assunto: '',
    mensagem: '',
  });
  const [formStatus, setFormStatus] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();

    setFormStatus('A sua mensagem foi enviada com sucesso! Entraremos em contacto em breve.');
    setFormData({ nome: '', email: '', assunto: '', mensagem: '' });
  };

  return (
    <>
      <Head>
        <title>Contacto - A Nossa Loja</title>
        <meta
          name="description"
          content="Entre em contacto connosco. Estamos disponíveis para responder às suas questões através do nosso formulário, telefone ou email."
        />
      </Head>

      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">Entre em Contacto</h1>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Tem alguma questão? A nossa equipa está pronta para ajudar.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Envie-nos uma Mensagem</h2>
              {formStatus ? (
                <div className="bg-green-100 text-green-800 p-4 rounded-md">{formStatus}</div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                      Nome
                    </label>
                    <input
                      type="text"
                      name="nome"
                      id="nome"
                      required
                      value={formData.nome}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="assunto" className="block text-sm font-medium text-gray-700">
                      Assunto
                    </label>
                    <input
                      type="text"
                      name="assunto"
                      id="assunto"
                      required
                      value={formData.assunto}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="mensagem" className="block text-sm font-medium text-gray-700">
                      Mensagem
                    </label>
                    <textarea
                      name="mensagem"
                      id="mensagem"
                      rows="4"
                      required
                      value={formData.mensagem}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Enviar Mensagem
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div className="space-y-8">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-gray-900">A Nossa Morada</h3>
                <p className="mt-2 text-gray-600">
                  Rua das Inovações, 123
                  <br />
                  1000-001 Lisboa, Portugal
                </p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-gray-900">Contacto Direto</h3>
                <p className="mt-2 text-gray-600">
                  <strong>Email:</strong> geral@anossaloja.pt
                  <br />
                  <strong>Telefone:</strong> +351 210 000 000
                </p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-gray-900">Horário de Funcionamento</h3>
                <p className="mt-2 text-gray-600">
                  Segunda a Sexta: 9:00 - 18:00
                  <br />
                  Sábado: 10:00 - 14:00
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
