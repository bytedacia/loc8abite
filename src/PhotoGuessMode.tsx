import React, { useState, useEffect } from 'react';
import './PhotoGuessMode.css';
import PhotoDisplay from './PhotoDisplay';
import MapSection from './MapSection';
import ResultModal from './ResultModal';
import { haversineDistance, calculateScore } from './haversine';

interface PhotoData {
  image: string;
  lat: number;
  lng: number;
  place: string;
}

export type LatLng = { lat: number; lng: number };

function getRandomIndex(length: number) {
  return Math.floor(Math.random() * length);
}

// Score calculation: max 100, min 1, linearly decreasing with distance (0 at 20000km)
function getFeedbackPhrase(distance: number): string {
  if (distance < 0.1) return 'Incredible! Spot on!';
  if (distance < 10) return 'Amazing! Super close!';
  if (distance < 100) return 'Very close!';
  if (distance < 250) return 'Not bad!';
  if (distance < 500) return 'Pretty far!';
  return 'Way off! Try again!';
}

const PhotoGuessMode: React.FC = () => {
  const [photoData, setPhotoData] = useState<PhotoData[]>([]);
  const [currentPhotoIdx, setCurrentPhotoIdx] = useState(0);
  const [guess, setGuess] = useState<LatLng | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = React.useState<number | null>(null);

  useEffect(() => {
    fetch('/src/data.json')
      .then((res) => res.json())
      .then((data) => {
        setPhotoData(data);
        setCurrentPhotoIdx(getRandomIndex(data.length));
      });
  }, []);

  const currentPhoto = photoData[currentPhotoIdx];

  const handleMapClick = (lat: number, lng: number) => {
    setGuess({ lat, lng });
  };

  const handleSubmit = () => {
    if (!guess || !currentPhoto) return;
    const distance = haversineDistance(guess.lat, guess.lng, currentPhoto.lat, currentPhoto.lng);
    const scoreValue = calculateScore(distance);
    setScore(scoreValue);
    const phrase = getFeedbackPhrase(distance);
    setResult(
      `Your guess was ${distance.toFixed(2)} km away.\n${phrase}\nScore: ${scoreValue}/100`
    );
    setShowResult(true);
  };

  const handleNext = () => {
    setGuess(null);
    setResult(null);
    setShowResult(false);
    setScore(null);
    if (photoData.length > 0) {
      setCurrentPhotoIdx(getRandomIndex(photoData.length));
    }
  };

  if (!currentPhoto) return <div>Loading...</div>;

  return (
    <div className="photo-guess-mode">
      <h2>Photo Guess Mode</h2>
      <PhotoDisplay url={currentPhoto.image} name={currentPhoto.place} />
      <MapSection guess={guess} onMapClick={handleMapClick} />
      <button onClick={handleSubmit} disabled={!guess} className="submit-btn">
        Submit Guess
      </button>
      <ResultModal result={result} show={showResult} onNext={handleNext} score={score} />
    </div>
  );
};

export default PhotoGuessMode;
