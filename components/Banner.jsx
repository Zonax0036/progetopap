export function Banner() {
  return (
    <div className="bg-blue-600 text-white rounded-lg p-8 mb-8">
      {/* Título principal do banner */}
      <h2 className="text-2xl font-bold mb-4">
        Descubra nossa nova coleção de produtos de alto desempenho.
      </h2>
      
      {/* Container para os botões de ação */}
      <div className="flex space-x-4">
        {/* Botão primário - "Explorar Agora" */}
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Explorar Agora
        </button>
        
        {/* Botão secundário - "Ver Ofertas" */}
        <button className="bg-white hover:bg-gray-100 text-blue-600 font-bold py-2 px-4 rounded">
          Ver Ofertas
        </button>
      </div>
    </div>
  );
}
