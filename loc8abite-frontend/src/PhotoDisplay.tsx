import React, { useState } from "react";

interface PhotoDisplayProps {
  url: string;
  name: string;
  onImageLoad?: () => void;
}

const PhotoDisplay: React.FC<PhotoDisplayProps> = ({
  url,
  name,
  onImageLoad,
}) => {
  const [loaded, setLoaded] = useState(false);

  const handleLoad = () => {
    setLoaded(true);
    if (onImageLoad) onImageLoad();
  };

  return (
    <div className="photo-section">
      <h2>Guess the location!</h2>
      <p>{name}</p>

      {!loaded && <div className="image-placeholder">Loading image...</div>}

      <div className="image-wrapper">
        {!loaded && <div className="image-placeholder">Loading image...</div>}
        <img
          src={url}
          onLoad={handleLoad}
          alt="Guess location"
          className="guess-photo"
          style={{ display: loaded ? "block" : "none" }}
        />
      </div>
    </div>
  );
};

export default PhotoDisplay;
