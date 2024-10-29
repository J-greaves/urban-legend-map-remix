// Marker.tsx
import React, { useEffect } from "react";
import maplibregl from "maplibre-gl";

interface MarkerProps {
  position: [number, number];
  map: maplibregl.Map;
}

const Marker: React.FC<MarkerProps> = ({ position, map }) => {
  useEffect(() => {
    const marker = new maplibregl.Marker().setLngLat(position).addTo(map);

    return () => {
      marker.remove();
    }; // Cleanup
  }, [map, position]);

  return null; // No additional rendering for the marker component
};

export default Marker;
