import { useState } from "react";
import axios from "axios";
import Layout2 from "../components/Layout2";
import Link from "next/link";
import { FaEnvelope, FaArrowLeft } from "react-icons/fa";

export default function RedefinirSenha() {
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState({ tipo: "", texto: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setMensagem({ tipo: "erro", texto: "Por favor, informe seu email." });
      return;
    }

    try {
      setLoading(true);
      await axios.post("/api/redefinir", { email });
      setMensagem({ 
        tipo: "sucesso", 
        texto: "Se este email existir, um link de redefinição foi enviado." 
      });
      setEmail("");
    } catch (error) {
      console.error("Erro ao processar solicitação:", error);
      setMensagem({ 
        tipo: "erro", 
        texto: "Ocorreu um erro ao processar sua solicitação. Tente novamente." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout2>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 -mt-20">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
          <div>
            <div className="flex justify-center">
              <div className="bg-blue-600 text-white p-3 rounded-xl">
                <FaEnvelope className="h-10 w-10" />
              </div>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Redefinir sua senha
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Informe seu email para receber um link de redefinição de senha.
            </p>
          </div>
          
          {mensagem.texto && (
            <div className={`p-4 rounded-md ${
              mensagem.tipo === "erro" 
                ? "bg-red-50 border-l-4 border-red-500 text-red-700" 
                : "bg-green-50 border-l-4 border-green-500 text-green-700"
            }`}>
              {mensagem.texto}
            </div>
          )}
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Seu email"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${
                  loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200`}
              >
                {loading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : null}
                {loading ? 'Enviando...' : 'Enviar Link de Redefinição'}
              </button>
            </div>
          </form>

          <div className="text-center">
            <Link href="/login" className="text-sm text-blue-600 hover:text-blue-500 flex items-center justify-center">
              <FaArrowLeft className="mr-2" /> Voltar para o login
            </Link>
          </div>
        </div>
      </div>
    </Layout2>
  );
}
