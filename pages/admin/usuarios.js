// pages/admin/usuarios.js
import { GerenciamentoUsuarios } from '../../components/admin/GerenciamentoUsuarios';
import { useState } from 'react';

export default function PaginaUsuarios() {
  const [loading, setLoading] = useState(true);
  
  return (
    <div className="flex h-screen overflow-hidden">
      {/* A barra lateral principal será injetada pelo layout padrão do Next.js */}
      <main className="flex-1 overflow-auto p-6 bg-gray-100">
        <h1 className="text-2xl font-bold mb-6">Gerenciamento de Usuários</h1>
        <p className="text-gray-600 mb-4">Visualize, ative/desative ou exclua usuários do sistema</p>
        
        <GerenciamentoUsuarios loading={loading} />
      </main>
    </div>
  );
}

// Defina o layout da página - Importante!
PaginaUsuarios.getLayout = function getLayout(page) {
  // Não use o AdminLayout aqui, deixe o _app.js aplicar o layout padrão
  return page;
};
