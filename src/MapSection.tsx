import React from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
type LatLng = { lat: number; lng: number };

interface MapSectionProps {
  guess: LatLng | null;
  correct?: LatLng | null;
  onMapClick: (lat: number, lng: number) => void;
}

const defaultCenter = { lat: 48.8584, lng: 2.2945 }; // Eiffel Tower

// Fix default marker icon for Leaflet in React
const markerIcon = new L.Icon({
  iconUrl: "blue.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "marker-shadow.png",
  shadowSize: [41, 41],
});

const correctMarkerIcon = new L.Icon({
  iconUrl: "green.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const ClickHandler: React.FC<{
  onMapClick: (lat: number, lng: number) => void;
}> = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const MapSection: React.FC<MapSectionProps> = ({
  guess,
  correct,
  onMapClick,
}) => {
  return (
    <div className="map-section">
      <MapContainer
        center={guess || defaultCenter}
        zoom={2}
        style={{
          width: "100%",
          height: "300px",
          borderRadius: "8px",
          marginBottom: "0.5rem",
        }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler onMapClick={onMapClick} />
        {guess && <Marker position={guess} icon={markerIcon} />}
        {/* show correct location */}
        {correct && <Marker position={correct} icon={correctMarkerIcon} />}
      </MapContainer>
      {guess ? (
        <div className="guess-coords">
          Marker at: {guess.lat.toFixed(4)}, {guess.lng.toFixed(4)}
        </div>
      ) : null}
    </div>
  );
};

export default MapSection;
