import React, { useState, useEffect, useRef } from "react";
import "./PhotoGuessMode.css";
import PhotoDisplay from "./PhotoDisplay";
import MapSection from "./MapSection";
import ResultModal from "./ResultModal";
import { haversineDistance, calculateScore } from "./haversine";
import confetti from "canvas-confetti";

interface PhotoData {
  image: string;
  lat: number;
  lng: number;
  name: string;
  type: string;
}

export type LatLng = { lat: number; lng: number };

interface PhotoGuessModeProps {
  onBack?: () => void;
}

function getRandomIndex(length: number) {
  return Math.floor(Math.random() * length);
}

function getFeedbackPhrase(distance: number): string {
  if (distance < 0.1) return "Incredible! Spot on!";
  if (distance < 10) return "Amazing! Super close!";
  if (distance < 100) return "Very close!";
  if (distance < 250) return "Not bad!";
  if (distance < 500) return "Pretty far!";
  return "Way off! Try again!";
}

const PhotoGuessMode: React.FC<PhotoGuessModeProps> = ({ onBack }) => {
  const [photoData, setPhotoData] = useState<PhotoData[]>([]);
  const [currentPhotoIdx, setCurrentPhotoIdx] = useState(0);
  const [guess, setGuess] = useState<LatLng | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [started, setStarted] = useState(false);
  const [flashCelebration, setFlashCelebration] = useState(false);
  const [revealCorrect, setRevealCorrect] = useState(false);

  useEffect(() => {
    fetch("http://localhost:4000/api/wikidata/places")
      .then((res) => res.json())
      .then((data) => setPhotoData(data))
      .catch((err) => console.error("Failed to fetch photo data:", err));
  }, []);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("/audio/celebrate.mp3");
  }, []);

  const startRound = () => {
    if (photoData.length > 0) {
      setCurrentPhotoIdx(getRandomIndex(photoData.length));
      setStarted(true);
    }
  };

  const currentPhoto = photoData[currentPhotoIdx];

  const handleMapClick = (lat: number, lng: number) => {
    setGuess({ lat, lng });
  };

  const handleSubmit = () => {
    if (!guess || !currentPhoto) return;
    const distance = haversineDistance(
      guess.lat,
      guess.lng,
      currentPhoto.lat,
      currentPhoto.lng
    );
    const scoreValue = calculateScore(distance);
    setScore(scoreValue);
    const phrase = getFeedbackPhrase(distance);
    setResult(
      `Your guess was ${distance.toFixed(
        2
      )} km away.\n${phrase}\nScore: ${scoreValue}/100`
    );
    setShowResult(true);

    if (scoreValue >= 90) {
      confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
      setFlashCelebration(true);
    }
  };

  const handleNext = () => {
    setGuess(null);
    setResult(null);
    setShowResult(false);
    setScore(null);
    setRevealCorrect(false);
    if (photoData.length > 0) {
      setCurrentPhotoIdx(getRandomIndex(photoData.length));
    }
    setFlashCelebration(false);
  };

  if (!currentPhoto) return <div>Loading...</div>;

  return (
    <div className={`photo-guess-mode ${flashCelebration ? "flash-bg" : ""}`}>
      {!started ? (
        <div className="card-options">
          <div className="card-option start-card" onClick={startRound}>
            <h3>▶️ Start Photo Guess</h3>
            <p>Try to guess where the photo was taken!</p>
          </div>
          {onBack && (
            <div className="card-option back-card" onClick={onBack}>
              <h3>🔙 Back to Menu</h3>
              <p>Return to the mode selection screen.</p>
            </div>
          )}
        </div>
      ) : (
        <>
          <PhotoDisplay url={currentPhoto.image} name={currentPhoto.name} />
          <MapSection
            guess={guess}
            correct={
              revealCorrect
                ? { lat: currentPhoto.lat, lng: currentPhoto.lng }
                : null
            }
            onMapClick={handleMapClick}
          />
          <button
            onClick={handleSubmit}
            disabled={!guess}
            className="submit-btn"
          >
            Submit Guess
          </button>
          {showResult && !revealCorrect && (
            <button
              onClick={() => setRevealCorrect(true)}
              className="correct-btn"
            >
              Correct Location
            </button>
          )}
          <button
            onClick={handleNext}
            className="correct-btn skip-btn"
            style={{ marginTop: "0.5rem" }}
          >
            ⏭️ Skip / Next Photo
          </button>

          <ResultModal
            result={result}
            show={showResult}
            // onNext={handleNext}
            score={score}
          />
        </>
      )}
    </div>
  );
};

export default PhotoGuessMode;
