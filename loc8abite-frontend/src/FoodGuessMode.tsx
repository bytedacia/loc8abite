// import React, { useState, useEffect, useRef } from "react";
// import "./FoodGuessMode.css";
// import PhotoDisplay from "./PhotoDisplayFood";
// import MapSection from "./MapSectionFood";
// import ResultModal from "./ResultModalFood";
// import confetti from "canvas-confetti";

// interface PhotoData {
//   image: string;
//   country: string;
//   name: string;
//   type: string;
// }

// interface CountryPolygon {
//   name: string;
//   coordinates: [number, number][][];
// }

// interface FoodGuessModeProps {
//   onBack?: () => void;
// }

// const FoodGuessMode: React.FC<FoodGuessModeProps> = ({ onBack }) => {
//   const [photoData, setPhotoData] = useState<PhotoData[]>([]);
//   const [currentPhotoIdx, setCurrentPhotoIdx] = useState(0);
//   const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
//   const [result, setResult] = useState<string | null>(null);
//   const [showResult, setShowResult] = useState(false);
//   const [score, setScore] = useState<number | null>(null);
//   const [started, setStarted] = useState(false);
//   const [flashCelebration, setFlashCelebration] = useState(false);
//   const [revealCorrect, setRevealCorrect] = useState(false);
//   const [countryPolygons, setCountryPolygons] = useState<CountryPolygon[]>([]);

//   const audioRef = useRef<HTMLAudioElement | null>(null);

//   useEffect(() => {
//     fetch("http://localhost:4000/api/wikidata/food")
//       .then((res) => res.json())
//       .then((data) => setPhotoData(data))
//       .catch((err) => console.error("Failed to fetch photo data:", err));

//     fetch("/data.json")
//       .then((res) => res.json())
//       .then((rawData) => {
//         const parsed = rawData.map((entry: any) => {
//           const rawCoords = entry.xml.outerBoundaryIs.LinearRing.coordinates;
//           const latLngArray = rawCoords
//             .trim()
//             .split(" ")
//             .map((coordPair: string) => {
//               const [lng, lat] = coordPair.split(",").map(Number);
//               return [lng, lat] as [number, number];
//             });
//           console.log(rawData);
//           return {
//             name: entry.country,
//             coordinates: [latLngArray],
//           };
//         });
//         setCountryPolygons(parsed);
//       })
//       .catch((err) => console.error("Failed to fetch country polygons:", err));
//   }, []);

//   useEffect(() => {
//     audioRef.current = new Audio("/audio/celebrate.mp3");
//   }, []);

//   const startRound = () => {
//     if (photoData.length > 0) {
//       const randomIndex = Math.floor(Math.random() * photoData.length);
//       setCurrentPhotoIdx(randomIndex);
//       setStarted(true);
//     }
//   };

//   const currentPhoto = photoData[currentPhotoIdx];

//   const handleCountrySelect = (countryName: string) => {
//     setSelectedCountry(countryName);
//   };

//   const handleSubmit = () => {
//     if (!selectedCountry || !currentPhoto) return;

//     const isCorrect = selectedCountry === currentPhoto.country;
//     const scoreValue = isCorrect ? 100 : 0;
//     setScore(scoreValue);

//     const resultMessage = isCorrect
//       ? "Correct! 🎉 You guessed the right country!"
//       : `Incorrect. You chose ${selectedCountry}, but the correct answer was ${currentPhoto.country}.`;

//     setResult(`${resultMessage}\nScore: ${scoreValue}/100`);
//     setShowResult(true);

//     if (isCorrect && audioRef.current) {
//       confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
//       audioRef.current.currentTime = 0;
//       audioRef.current.play();
//       setFlashCelebration(true);
//     }
//   };

//   const handleNext = () => {
//     setSelectedCountry(null);
//     setResult(null);
//     setShowResult(false);
//     setScore(null);
//     setRevealCorrect(false);
//     setFlashCelebration(false);

//     if (photoData.length > 0) {
//       const randomIndex = Math.floor(Math.random() * photoData.length);
//       setCurrentPhotoIdx(randomIndex);
//     }
//   };

//   if (!currentPhoto) return <div>Loading...</div>;

//   return (
//     <div className={`photo-guess-mode ${flashCelebration ? "flash-bg" : ""}`}>
//       {!started ? (
//         <div className="card-options">
//           <div className="card-option start-card" onClick={startRound}>
//             <h3>▶️ Start Food Guess</h3>
//             <p>Try to guess which country this food is from!</p>
//           </div>
//           {onBack && (
//             <div className="card-option back-card" onClick={onBack}>
//               <h3>🔙 Back to Menu</h3>
//               <p>Return to mode selection screen</p>
//             </div>
//           )}
//         </div>
//       ) : (
//         <>
//           <PhotoDisplay url={currentPhoto.image} name={currentPhoto.name} />
//           <MapSection
//             countryPolygons={countryPolygons}
//             onCountrySelect={handleCountrySelect}
//             selectedCountry={selectedCountry}
//             correctCountry={revealCorrect ? currentPhoto.country : null}
//           />
//           <button
//             onClick={handleSubmit}
//             disabled={!selectedCountry}
//             className="submit-btn"
//           >
//             Submit Guess
//           </button>
//           {showResult && !revealCorrect && (
//             <button
//               onClick={() => setRevealCorrect(true)}
//               className="correct-btn"
//             >
//               Reveal Correct Country
//             </button>
//           )}
//           <button
//             onClick={handleNext}
//             className="correct-btn skip-btn"
//             style={{ marginTop: "0.5rem" }}
//           >
//             ⏭️ Skip / Next Photo
//           </button>

//           <ResultModal result={result} show={showResult} score={score} />
//         </>
//       )}
//     </div>
//   );
// };

// export default FoodGuessMode;

import React, { useState, useEffect, useRef } from "react";
import "./PhotoGuessMode.css";
import PhotoDisplay from "./PhotoDisplayFood";
import WorldMap from "./WorldMap";
import ResultModal from "./ResultModalFood";
import confetti from "canvas-confetti";

interface PhotoData {
  image: string;
  country: string;
  name: string;
  type: string;
}

interface FoodGuessModeProps {
  onBack?: () => void;
}

const FoodGuessMode: React.FC<FoodGuessModeProps> = ({ onBack }) => {
  const [photoData, setPhotoData] = useState<PhotoData[]>([]);
  const [currentPhotoIdx, setCurrentPhotoIdx] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [started, setStarted] = useState(false);
  const [flashCelebration, setFlashCelebration] = useState(false);
  const [revealCorrect, setRevealCorrect] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetch("http://localhost:4000/api/wikidata/food")
      .then((res) => res.json())
      .then((data) => setPhotoData(data))
      .catch((err) => console.error("Failed to fetch photo data:", err));
  }, []);

  useEffect(() => {
    audioRef.current = new Audio("/audio/celebrate.mp3");
  }, []);

  const startRound = () => {
    if (photoData.length > 0) {
      setCurrentPhotoIdx(Math.floor(Math.random() * photoData.length));
      setStarted(true);
    }
  };

  const currentPhoto = photoData[currentPhotoIdx];

  const handleCountrySelect = (countryName: string) => {
    setSelectedCountry(countryName);
  };

  const handleSubmit = () => {
    if (!selectedCountry || !currentPhoto) return;

    const isCorrect =
      selectedCountry?.toLowerCase().trim() ===
      currentPhoto.country.toLowerCase().trim();

    const scoreValue = isCorrect ? 100 : 0;
    setScore(scoreValue);

    const resultMessage = isCorrect
      ? "Correct! 🎉 You guessed the right country!"
      : `Incorrect. You chose ${selectedCountry}, but the correct answer was ${currentPhoto.country}.`;

    setResult(`${resultMessage}\nScore: ${scoreValue}/100`);
    setShowResult(true);

    if (isCorrect && audioRef.current) {
      confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setFlashCelebration(true);
    }
  };

  const handleNext = () => {
    setSelectedCountry(null);
    setResult(null);
    setShowResult(false);
    setScore(null);
    setRevealCorrect(false);
    setFlashCelebration(false);

    if (photoData.length > 0) {
      setCurrentPhotoIdx(Math.floor(Math.random() * photoData.length));
    }
  };

  if (!currentPhoto) return <div>Loading...</div>;

  return (
    <div className={`photo-guess-mode ${flashCelebration ? "flash-bg" : ""}`}>
      {!started ? (
        <div className="card-options">
          <div className="card-option start-card" onClick={startRound}>
            <h3>▶️ Start Food Guess</h3>
            <p>Try to guess which country this food is from!</p>
          </div>
          {onBack && (
            <div className="card-option back-card" onClick={onBack}>
              <h3>🔙 Back to Menu</h3>
              <p>Return to mode selection screen</p>
            </div>
          )}
        </div>
      ) : (
        <>
          <PhotoDisplay url={currentPhoto.image} name={currentPhoto.name} />
          <WorldMap
            onCountrySelect={handleCountrySelect}
            selectedCountry={selectedCountry}
          />
          <button
            onClick={handleSubmit}
            disabled={!selectedCountry}
            className="submit-btn"
          >
            Submit Guess
          </button>
          {showResult && !revealCorrect && (
            <button
              onClick={() => setRevealCorrect(true)}
              className="correct-btn"
            >
              Reveal Correct Country
            </button>
          )}
          <button
            onClick={handleNext}
            className="correct-btn skip-btn"
            style={{ marginTop: "0.5rem" }}
          >
            ⏭️ Skip / Next Photo
          </button>

          <ResultModal result={result} show={showResult} score={score} />
        </>
      )}
    </div>
  );
};

export default FoodGuessMode;
