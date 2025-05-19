import React, { useState, useEffect } from 'react';
import './PhotoGuessMode.css';
import PhotoDisplay from './PhotoDisplay';
import MapSection from './MapSection';
import ResultModal from './ResultModal';

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

const ERROR_MARGIN = 5; // degrees

const PhotoGuessMode: React.FC = () => {
  const [photoData, setPhotoData] = useState<PhotoData[]>([]);
  const [currentPhotoIdx, setCurrentPhotoIdx] = useState(0);
  const [guess, setGuess] = useState<LatLng | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

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

  const isCorrectGuess = (guess: LatLng, answer: PhotoData) => {
    return (
      Math.abs(guess.lat - answer.lat) <= ERROR_MARGIN &&
      Math.abs(guess.lng - answer.lng) <= ERROR_MARGIN
    );
  };

  const handleSubmit = () => {
    if (!guess || !currentPhoto) return;
    if (isCorrectGuess(guess, currentPhoto)) {
      setResult(`Correct! You found ${currentPhoto.place}.`);
    } else {
      setResult(
        `Your guess is not close enough. The correct location was ${currentPhoto.place}.`
      );
    }
    setShowResult(true);
  };

  const handleNext = () => {
    setGuess(null);
    setResult(null);
    setShowResult(false);
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
      <ResultModal result={result} show={showResult} onNext={handleNext} />
    </div>
  );
};

export default PhotoGuessMode;
