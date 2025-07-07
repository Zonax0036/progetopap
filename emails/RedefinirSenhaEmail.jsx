import React from 'react';

export default function RedefinirSenhaEmail({ urlRedefinicao }) {
  return (
    <div>
      <h1>Redefinição de Senha</h1>
      <p>Você solicitou a redefinição da sua senha. Clique no link abaixo para criar uma nova senha:</p>
      <a href={urlRedefinicao}>Redefinir Senha</a>
      <p>Se você não solicitou esta alteração, por favor, ignore este email.</p>
    </div>
  );
}