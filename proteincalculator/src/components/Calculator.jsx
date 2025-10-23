import React, { useState } from 'react';
import { proteinaDB } from '../data/proteinData';

const categorias = {
  'todos': 'Todos',
  'cru': 'Crus',
  'grelhado': 'Grelhados / Fritos / Assados',
  'cozido': 'Cozidos (Água)',
  'empanado': 'Fritos (Empanados)',
  'suplementos': 'Suplementos',
  'outros': 'Outros (Ovos, Veganos, etc.)'
};

function Calculator() {
    const [categoriaSelecionada, setCategoriaSelecionada] = useState('todos');
    const [alimentoSelecionado, setAlimentoSelecionado] = useState(Object.keys(proteinaDB)[0]);
    
    const [modo, setModo] = useState('gramasPorProteina');
    const [valorInserido, setValorInserido] = useState(100);
    const [resultado, setResultado] = useState(null);
    
    const ehGramasPorProteina = modo === 'gramasPorProteina';
    const inputLabel = ehGramasPorProteina ? 'Quantidade do Alimento (em gramas)' : 'Proteína Desejada (em gramas)';
    const buttonLabel = ehGramasPorProteina ? 'Calcular Proteína' : 'Calcular Gramas do Alimento';
    const resultPrefix = ehGramasPorProteina ? 'Total de Proteína:' : 'Você precisa de:';
    const resultSuffix = ehGramasPorProteina ? 'g de proteína' : 'g de alimento';

    const alimentosFiltrados = Object.keys(proteinaDB).filter(key => {
      if (categoriaSelecionada === 'todos') {
        return true;
      }
      return proteinaDB[key].category === categoriaSelecionada;
    });

    const handleCategoryChange = (e) => {
      const novaCategoria = e.target.value;
      setCategoriaSelecionada(novaCategoria);

      const novosAlimentosFiltrados = Object.keys(proteinaDB).filter(key => {
        if (novaCategoria === 'todos') return true;
        return proteinaDB[key].category === novaCategoria;
      });

      if (novosAlimentosFiltrados.length > 0) {
        setAlimentoSelecionado(novosAlimentosFiltrados[0]);
      } else {
        setAlimentoSelecionado('');
      }
      
      setResultado(null);
    };
    
    const handleAlimentoChange = (e) => {
      setAlimentoSelecionado(e.target.value);
    };

    const handleCalculate = (e) => {
        e.preventDefault();

        if (!alimentoSelecionado || !proteinaDB[alimentoSelecionado]) {
          setResultado("0.0");
          return;
        }

        const alimento = proteinaDB[alimentoSelecionado];
        const proteinaPor100g = alimento.protein; 
        
        let resultadoCalculado;

        if (ehGramasPorProteina)
        {
            resultadoCalculado = (proteinaPor100g / 100) * valorInserido;
        }
        else
        {
            resultadoCalculado = (valorInserido / proteinaPor100g) * 100;
        }

        if (isNaN(resultadoCalculado)) {
          setResultado("0.0");
        } else {
          setResultado(resultadoCalculado.toFixed(1));
        }
    };
  
    const handleModeChange = (novoModo) => {
      setModo(novoModo);
      setValorInserido(100);
      setResultado(null);
    }

return (
    <div className="max-w-md w-full p-6 bg-preto-1 rounded-lg shadow-md">
      
      <h1 className="text-2xl font-bold text-center text-branco-1 mb-6">
        Calculadora de Proteínas
      </h1>

      <div className="flex mb-4 rounded-md shadow-sm">
        <button
          onClick={() => handleModeChange('gramasPorProteina')}
          className={`flex-1 py-2 px-4 rounded-l-md transition-colors
            ${ehGramasPorProteina 
              ? 'bg-green-600 text-branco-1 font-semibold' 
              : 'bg-branco-1 text-gray-700 hover:bg-gray-100'}
          `}
        >
          Gramas ➔ Proteína
        </button>
        <button
          onClick={() => handleModeChange('proteinaPorGramas')}
          className={`flex-1 py-2 px-4 rounded-r-md transition-colors
            ${!ehGramasPorProteina 
              ? 'bg-green-600 text-branco-1 font-semibold' 
              : 'bg-branco-1 text-gray-700 hover:bg-gray-100'}
          `}
        >
          Proteína ➔ Gramas
        </button>
      </div>
      
      <form onSubmit={handleCalculate}>
        <div className="mb-4">
            <label htmlFor="categoria" className="block text-sm font-medium text-white mb-1">
                Filtrar por Categoria
            </label>
            <select
                id="categoria"
                value={categoriaSelecionada}
                onChange={handleCategoryChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-700 focus:border-green-700"
            >
            {Object.keys(categorias).map((key) => (
                <option key={key} value={key}>
                    {categorias[key]}
                </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
            <label htmlFor="alimento" className="block text-sm font-medium text-white mb-1">
                Selecione o Alimento
            </label>
            <select
                id="alimento"
                value={alimentoSelecionado}
                onChange={handleAlimentoChange}
                disabled={alimentosFiltrados.length === 0}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-700 focus:border-green-700 disabled:bg-gray-50 disabled:cursor-not-allowed"
            >
                {alimentosFiltrados.map((key) => (
                    <option key={key} value={key}>
                        {proteinaDB[key].name}
                    </option>
                ))}
            </select>
        </div>


        <div className="mb-6">
            <label htmlFor="valor-inserido" className="block text-sm font-medium text-white mb-1">
                {inputLabel}
            </label>
            <input
                type="number"
                id="valor-inserido"
                value={valorInserido}
                onChange={(e) => setValorInserido(Number(e.target.value.slice(0, 9)))}
                min="0"
                disabled={!alimentoSelecionado}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-700 focus:border-green-700 disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
        </div>

        <button
          type="submit"
          disabled={!alimentoSelecionado}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-green-700 focus:outline-none focus:ring-2  focus:ring-green-700 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {buttonLabel}
        </button>
      </form>

      {resultado !== null && (
        <div className="mt-6 p-4 bg-green-100 border border-green-300 rounded-md text-center">
          <p className="text-lg font-medium text-green-800">
            {resultPrefix}
          </p>
          <p className="text-3xl font-bold text-green-800">
            {resultado}
            <span className="text-xl font-medium"> {resultSuffix}</span>
          </p>
        </div>
      )}
    </div>
  );
}

export default Calculator;