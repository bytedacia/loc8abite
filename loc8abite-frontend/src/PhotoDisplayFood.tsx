import React from "react";
import "./FoodGuessMode.css";

interface PhotoDisplayProps {
  url: string;
  name: string;
}

const PhotoDisplay: React.FC<PhotoDisplayProps> = ({ url, name }) => {
  return (
    <div className="photo-display-container">
      <h2 className="photo-title">🍽️ Guess the Origin!</h2>
      <img src={url} alt={name} className="food-image" />
      <p className="food-name">Food: {name}</p>
    </div>
  );
};

export default PhotoDisplay;
