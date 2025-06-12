import React from "react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Tooltip,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface CountryPolygon {
  name: string;
  coordinates: [number, number][][];
}

interface MapSectionProps {
  countryPolygons: CountryPolygon[];
  onCountrySelect: (countryName: string) => void;
  selectedCountry: string | null;
  correctCountry: string | null;
}

const MapSection: React.FC<MapSectionProps> = ({
  countryPolygons,
  onCountrySelect,
  selectedCountry,
  correctCountry,
}) => {
  return (
    <div className="map-section" style={{ height: "60vh", width: "100%" }}>
      <MapContainer
        center={[20, 0]}
        zoom={2}
        maxZoom={18}
        minZoom={2}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {countryPolygons.map((country, index) => {
          const isSelected = selectedCountry === country.name;
          const isCorrect = correctCountry === country.name;
          const fillColor = isCorrect
            ? "green"
            : isSelected
            ? "orange"
            : "blue";

          return (
            <Polygon
              key={index}
              positions={country.coordinates}
              pathOptions={{
                color: "black",
                fillColor,
                fillOpacity: 0.5,
                weight: 1,
              }}
              eventHandlers={{
                click: () => onCountrySelect(country.name),
              }}
            >
              <Tooltip>{country.name}</Tooltip>
            </Polygon>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapSection;
