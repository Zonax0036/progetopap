import { forwardRef, useRef, useImperativeHandle } from 'react';

export const DialogConfirm = forwardRef(
  ({ onConfirm, title = 'Confirmar', message = 'Tem certeza?' }, ref) => {
    const dialogRef = useRef();

    useImperativeHandle(ref, () => dialogRef.current); // <- Expondo o <dialog> diretamente

    const confirm = () => {
      dialogRef.current.close();
      onConfirm?.();
    };

    return (
      <dialog
        ref={dialogRef}
        className="rounded-xl shadow-xl p-6 w-[90%] max-w-md backdrop:bg-black/50"
      >
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <p className="text-sm text-gray-700 mb-6">{message}</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => dialogRef.current.close()}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancelar
          </button>
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

DialogConfirm.displayName = 'DialogConfirm';
