import React from "react";
import { MapContainer, TileLayer, Polygon, Tooltip } from "react-leaflet";
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
}) => (
  <div className="map-section" style={{ height: "60vh", width: "100%" }}>
    <MapContainer center={[20, 0]} zoom={2} style={{ height: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {countryPolygons.map((country, idx) => {
        const isSel = country.name === selectedCountry;
        const isCor = country.name === correctCountry;
        const fillColor = isCor ? "green" : isSel ? "orange" : "blue";

        return (
          <Polygon
            key={idx}
            positions={country.coordinates.map((ring) =>
              ring.map(([lng, lat]) => [lat, lng] as [number, number])
            )}
            pathOptions={{
              color: "black",
              fillColor,
              fillOpacity: 0.5,
              weight: 1,
            }}
            eventHandlers={{
              click: () => onCountrySelect(country.name),
              mouseover: (e) =>
                e.target.setStyle({ weight: 2, fillOpacity: 0.7 }),
              mouseout: (e) =>
                e.target.setStyle({ weight: 1, fillOpacity: 0.5 }),
            }}
          >
            <Tooltip>{country.name}</Tooltip>
          </Polygon>
        );
      })}
    </MapContainer>
  </div>
);

export default MapSection;
