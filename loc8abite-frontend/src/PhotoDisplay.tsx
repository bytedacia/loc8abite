import React from 'react';

interface PhotoDisplayProps {
  url: string;
  name: string;
}

const PhotoDisplay: React.FC<PhotoDisplayProps> = ({ url, name }) => (
  <div className="photo-section">
    <h2>Guess the location!</h2>
    <p>{name}</p>
    <img src={url} alt="Guess location" className="guess-photo" />
  </div>
);

export default PhotoDisplay;
