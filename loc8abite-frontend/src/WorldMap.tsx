import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import L, { type LeafletMouseEvent, type Layer } from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapSectionFoodProps {
  onCountrySelect: (countryName: string) => void;
  selectedCountry: string | null;
}

const WorldMap: React.FC<MapSectionFoodProps> = ({
  onCountrySelect,
  selectedCountry,
}) => {
  const [geoData, setGeoData] = useState<any>(null);
  const geoJsonRef = useRef<L.GeoJSON | null>(null);

  const highlightStyle = {
    weight: 2,
    color: "#ff7800",
    fillColor: "#f03",
    fillOpacity: 0.6,
  };

  const normalStyle = {
    weight: 1,
    color: "black",
    fillOpacity: 0.2,
    fillColor: "gray",
  };

  const onEachCountry = (feature: any, layer: Layer) => {
    const countryName = feature.properties.name;

    layer.on({
      mouseover: (e: LeafletMouseEvent) => {
        const target = e.target as L.Path;
        target.setStyle(highlightStyle);
        target.bringToFront();
      },
      mouseout: (e: LeafletMouseEvent) => {
        const target = e.target as L.Path;
        if (selectedCountry !== countryName) {
          target.setStyle(normalStyle);
        }
      },
      click: () => {
        onCountrySelect(countryName);
      },
    });

    // Initial style
    (layer as L.Path).setStyle(
      selectedCountry === countryName ? highlightStyle : normalStyle
    );
  };

  // Load GeoJSON data once
  useEffect(() => {
    fetch("/data/countries.geo.json")
      .then((res) => res.json())
      .then((data) => {
        setGeoData(data);
      })
      .catch((err) => console.error("Error loading GeoJSON:", err));
  }, []);

  // Update styles when selection changes
  useEffect(() => {
    if (geoJsonRef.current) {
      geoJsonRef.current.eachLayer((layer: L.Layer) => {
        const countryName = (layer as any).feature?.properties?.name;
        if (!countryName) return;

        (layer as L.Path).setStyle(
          selectedCountry === countryName ? highlightStyle : normalStyle
        );
      });
    }
  }, [selectedCountry]);

  return (
    <div className="map-section">
      {selectedCountry && (
        <p style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
          Selected: {selectedCountry}
        </p>
      )}
      <MapContainer
        center={[20, 0]}
        zoom={2}
        maxZoom={8}
        minZoom={2}
        scrollWheelZoom
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          noWrap
        />

        {geoData && (
          <GeoJSON
            key={selectedCountry || "default"} // force re-render on selection
            ref={(ref) => {
              if (ref) geoJsonRef.current = ref;
            }}
            data={geoData}
            onEachFeature={onEachCountry}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default WorldMap;
