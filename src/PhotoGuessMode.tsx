import React, { useState } from 'react';
import './PhotoGuessMode.css';

// Placeholder images and locations (to be replaced with real data)
const photoData = [
  {
    url: '/torre.jpg',
    answer: { lat: 48.8584, lng: 2.2945 }, // Example: Eiffel Tower
  },
  {
    url: '/torre.jpg',
    answer: { lat: 40.6892, lng: -74.0445 }, // Example: Statue of Liberty
  },
];

export type LatLng = { lat: number; lng: number };

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const PhotoGuessMode: React.FC = () => {
  const [currentPhotoIdx, setCurrentPhotoIdx] = useState(0);
  const [guess, setGuess] = useState<LatLng | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const currentPhoto = photoData[currentPhotoIdx];

  // Placeholder for map click handler
  const handleMapClick = (lat: number, lng: number) => {
    setGuess({ lat, lng });
  };

  const handleSubmit = () => {
    if (!guess) return;
    const d = haversineDistance(
      guess.lat,
      guess.lng,
      currentPhoto.answer.lat,
      currentPhoto.answer.lng
    );
    setDistance(d);
    setResult(`Your guess is ${d.toFixed(2)} km away!`);
    setShowResult(true);
  };

  const handleNext = () => {
    setGuess(null);
    setResult(null);
    setDistance(null);
    setShowResult(false);
    setCurrentPhotoIdx((idx) => (idx + 1) % photoData.length);
  };

  return (
    <div className="photo-guess-mode">
      <h2>Photo Guess Mode</h2>
      <div className="photo-section">
        <img src={currentPhoto.url} alt="Guess location" className="guess-photo" />
      </div>
      <div className="map-section">
        {/* TODO: Integrate Google Maps React component here */}
        <div className="map-placeholder" onClick={() => handleMapClick(48.8584, 2.2945)}>
          Click here to place a marker (mockup)
        </div>
        {guess && (
          <div className="guess-coords">
            Marker at: {guess.lat.toFixed(4)}, {guess.lng.toFixed(4)}
          </div>
        )}
      </div>
      <button onClick={handleSubmit} disabled={!guess} className="submit-btn">
        Submit Guess
      </button>
      {showResult && (
        <div className="result-modal">
          <div>{result}</div>
          <button onClick={handleNext}>Next Photo</button>
        </div>
      )}
    </div>
  );
};

export default PhotoGuessMode;
