import React from 'react';

export default function BoasVindasEmail({ nomeUtilizador }) {
  return (
    <div>
      <h1>Bem-vindo à nossa loja, {nomeUtilizador}!</h1>
      <p>Estamos muito felizes por ter você conosco.</p>
      <p>Explore nossos produtos e aproveite as melhores ofertas.</p>
    </div>
  );
}