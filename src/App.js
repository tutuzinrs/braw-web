import React from 'react';
import './App.css';
import Ranking from './components/Ranking'; // Importando o componente de ranking

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Ranking /> {/* Exibindo o componente de ranking */}
      </header>
    </div>
  );
}

export default App;
