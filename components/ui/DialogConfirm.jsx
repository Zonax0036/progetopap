import { forwardRef, useRef, useImperativeHandle } from 'react';

export const DialogConfirm = forwardRef(
  ({ onConfirm, title = 'Confirmar', message = 'Tem certeza?' }, ref) => {
    // Referência para acessar o elemento dialog nativo
    const dialogRef = useRef();

    // Expõe a referência do dialog para o componente pai
    // Isso permite que o componente pai chame métodos como show(), showModal() e close()
    useImperativeHandle(ref, () => dialogRef.current);

    // Função para confirmar a ação e fechar o diálogo
    const confirm = () => {
      dialogRef.current.close();
      onConfirm?.(); // Chama a função de callback se existir (usando optional chaining)
    };

    return (
      <dialog
        ref={dialogRef}
        className="rounded-xl shadow-xl p-6 w-[90%] max-w-md backdrop:bg-black/50"
      >
        {/* Título do diálogo */}
        <h2 className="text-lg font-semibold mb-4">{title}</h2>

        {/* Mensagem de confirmação */}
        <p className="text-sm text-gray-700 mb-6">{message}</p>

        {/* Botões de ação */}
        <div className="flex justify-end gap-2">
          {/* Botão de cancelar - apenas fecha o diálogo */}
          <button
            onClick={() => dialogRef.current.close()}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancelar
          </button>

          {/* Botão de confirmar - fecha o diálogo e executa a callback */}
          <button
            onClick={confirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Confirmar
          </button>
        </div>
      </dialog>
    );
  },
);

// Define um displayName para facilitar a depuração com React DevTools
DialogConfirm.displayName = 'DialogConfirm';
