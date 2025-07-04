import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { token } = router.query;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isValidToken, setIsValidToken] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        return;
      }
      try {
        await axios.get(`/api/redefinir/${token}`);
        setIsValidToken(true);
      } catch {
        setIsValidToken(false);
        setMessage({ type: 'erro', text: 'Token inválido ou expirado.' });
      }
    };
    verifyToken();
  }, [token]);

  const handleSubmit = async e => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage({ type: 'erro', text: 'As senhas não coincidem.' });
      return;
    }

    if (password.length < 6) {
      setMessage({ type: 'erro', text: 'A senha deve ter no mínimo 6 caracteres.' });
      return;
    }

    setLoading(true);
    try {
      await axios.post(`/api/redefinir/${token}`, { password });
      setMessage({
        type: 'sucesso',
        text: 'Sua senha foi redefinida com sucesso! Você já pode fazer login.',
      });
      setTimeout(() => router.push('/login'), 3000);
    } catch (error) {
      setMessage({
        type: 'erro',
        text: error.response?.data?.message || 'Ocorreu um erro ao redefinir sua senha.',
      });
    } finally {
      setLoading(false);
    }
  };

  if (isValidToken === null) {
    return <div className="text-center p-10">Verificando token...</div>;
  }

  if (!isValidToken) {
    return <div className="text-center p-10 text-red-500">{message.text}</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 -mt-20">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Crie uma nova senha</h2>
        {message.text && (
          <div
            className={`p-4 rounded-md ${message.type === 'erro' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
          >
            {message.text}
          </div>
        )}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="password">Nova Senha</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="pl-10 pr-10 w-full py-3 px-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="confirmPassword">Confirmar Nova Senha</label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                className="pl-10 pr-10 w-full py-3 px-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {loading ? 'Redefinindo...' : 'Redefinir Senha'}
          </button>
        </form>
      </div>
    </div>
  );
}
