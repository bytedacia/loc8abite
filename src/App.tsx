import React from 'react';
import './App.css';
import PhotoGuessMode from './PhotoGuessMode';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Loc8abite</h1>
        {/* Main menu for selecting modes (expandable for future modes) */}
      </header>
      <main>
        {/* Render PhotoGuessMode for now; later, add routing or mode selection */}
        <PhotoGuessMode />
      </main>
    </div>
  );
}

export default App;
