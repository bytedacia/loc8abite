import { useState } from "react";
import "./App.css";
import FoodGuessMode from "./FoodGuessMode";
import PhotoGuessMode from "./PhotoGuessMode";

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <h1>Loc8abite</h1>
//         {/* Main menu for selecting modes (expandable for future modes) */}
//       </header>
//       <main>
//         {/* Render PhotoGuessMode for now; later, add routing or mode selection */}
//         <PhotoGuessMode />
//         <FoodGuessMode />
//       </main>
//     </div>
//   );
// }

// export default App;

function App() {
  const [mode, setMode] = useState<"photo" | "food" | null>(null);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Loc8abite</h1>
      </header>
      <main>
        {mode === null && (
          <div className="mode-selection">
            <div className="mode-card" onClick={() => setMode("photo")}>
              <h3>📷 Photo Guess Mode</h3>
              <p>
                Guess the place by looking at a photo of a famous spot or scene.
              </p>
              <button>Play Now</button>
            </div>

            <div className="mode-card" onClick={() => setMode("food")}>
              <h3>🍽️ Food Guess Mode</h3>
              <p>
                Guess the location based on delicious restaurant food images.
              </p>
              <button>Play Now</button>
            </div>
          </div>
        )}

        {mode === "photo" && <PhotoGuessMode onBack={() => setMode(null)} />}
        {mode === "food" && <FoodGuessMode onBack={() => setMode(null)} />}
      </main>
    </div>
  );
}

export default App;
