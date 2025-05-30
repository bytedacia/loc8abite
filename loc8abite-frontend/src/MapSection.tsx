import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
type LatLng = { lat: number; lng: number };

interface MapSectionProps {
  guess: LatLng | null;
  correct?: LatLng | null;
  onMapClick: (lat: number, lng: number) => void;
}

const ResizeFixer = () => {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 100); // Delay ensures container is visible
  }, [map]);
  return null;
};

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

const worldBounds = L.latLngBounds(
  L.latLng(-85, -180), // Southwest corner
  L.latLng(85, 180) // Northeast corner
);

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
        maxBounds={worldBounds}
        maxBoundsViscosity={1.0}
        scrollWheelZoom={true}
        className="leaflet-container"
      >
        <ResizeFixer />
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
