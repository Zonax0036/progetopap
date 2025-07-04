import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

function CupomModal({ cupom, onClose, onSave }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: cupom || {
      codigo: '',
      tipo: 'percentual',
      valor: 0,
      data_validade: '',
      usos_maximos: 1,
      ativo: true,
    },
  });

  useEffect(() => {
    reset(cupom);
  }, [cupom, reset]);

  const onSubmit = async data => {
    try {
      const url = cupom ? `/api/cupons/${cupom.id}` : '/api/cupons';
      const method = cupom ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao salvar cupom');
      }

      toast.success(`Cupom ${cupom ? 'atualizado' : 'criado'} com sucesso!`);
      onSave();
      onClose();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">{cupom ? 'Editar Cupom' : 'Novo Cupom'}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Código</label>
            <input
              {...register('codigo', { required: 'Código é obrigatório' })}
              className="w-full p-2 border rounded"
            />
            {errors.codigo && <p className="text-red-500 text-sm">{errors.codigo.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tipo</label>
            <select {...register('tipo')} className="w-full p-2 border rounded">
              <option value="percentual">Percentual</option>
              <option value="fixo">Fixo</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Valor</label>
            <input
              type="number"
              step="0.01"
              {...register('valor', { required: 'Valor é obrigatório', valueAsNumber: true })}
              className="w-full p-2 border rounded"
            />
            {errors.valor && <p className="text-red-500 text-sm">{errors.valor.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Data de Validade</label>
            <input
              type="date"
              {...register('data_validade', { required: 'Data de validade é obrigatória' })}
              className="w-full p-2 border rounded"
            />
            {errors.data_validade && (
              <p className="text-red-500 text-sm">{errors.data_validade.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Usos Máximos</label>
            <input
              type="number"
              {...register('usos_maximos', { valueAsNumber: true })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('ativo')}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">Ativo</label>
          </div>
          <div className="flex justify-end space-x-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CuponsAdminPage() {
  const [cupons, setCupons] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCupom, setSelectedCupom] = useState(null);

  const fetchCupons = async () => {
    try {
      const response = await fetch('/api/cupons');
      const data = await response.json();
      setCupons(data);
    } catch (error) {
      toast.error('Erro ao buscar cupons');
    }
  };

  useEffect(() => {
    fetchCupons();
  }, []);

  const handleSave = () => {
    fetchCupons();
  };

  const handleDelete = async id => {
    if (window.confirm('Tem certeza que deseja deletar este cupom?')) {
      try {
        const response = await fetch(`/api/cupons/${id}`, { method: 'DELETE' });
        if (!response.ok) {
          throw new Error('Erro ao deletar cupom');
        }
        toast.success('Cupom deletado com sucesso!');
        fetchCupons();
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gerenciar Cupons</h1>
        <button
          onClick={() => {
            setSelectedCupom(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Novo Cupom
        </button>
      </div>

      {isModalOpen && (
        <CupomModal
          cupom={selectedCupom}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Código
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Validade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cupons.map(cupom => (
              <tr key={cupom.id}>
                <td className="px-6 py-4 whitespace-nowrap">{cupom.codigo}</td>
                <td className="px-6 py-4 whitespace-nowrap">{cupom.tipo}</td>
                <td className="px-6 py-4 whitespace-nowrap">{cupom.valor}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(cupom.data_validade).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${cupom.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                  >
                    {cupom.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => {
                      setSelectedCupom(cupom);
                      setIsModalOpen(true);
                    }}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(cupom.id)}
                    className="text-red-600 hover:text-red-900 ml-4"
                  >
                    Deletar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
