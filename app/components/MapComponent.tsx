import React, { useEffect, useState, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import Marker from "./Marker";
import MarkerModal from "./MarkerModal";
import MythModal from "./MythModal";

interface MapComponentProps {
  actionData: any; // Accept actionData as a prop
}

const MapComponent: React.FC<MapComponentProps> = ({ actionData }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<maplibregl.Map | null>(null);
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewMythModalOpen, setIsNewMythModalOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [mapSnapshot, setMapSnapshot] = useState<string | null>(null);

  useEffect(() => {
    if (mapContainerRef.current) {
      const initialisedMap = new maplibregl.Map({
        container: mapContainerRef.current,
        style:
          "https://api.maptiler.com/maps/80adff1c-a2b7-43ca-98f1-3139ca1e9695/style.json?key=gEmLBDE8Bs39pXFQEk0Q",
        center: [0, 0],
        zoom: 0,
      });

      initialisedMap.on("click", (event) => {
        setIsModalOpen(false);
        const lngLat: [number, number] = [event.lngLat.lng, event.lngLat.lat];
        setMarkerPosition(lngLat);
        setIsNewMythModalOpen(false);
        const { x, y } = initialisedMap.project(lngLat);
        setModalPosition({ top: y, left: x });
        setIsModalOpen(true);
      });

      initialisedMap.on("move", () => {
        setIsModalOpen(false);
        setIsNewMythModalOpen(false);
      });

      setMap(initialisedMap);
      return () => initialisedMap.remove();
    }
  }, []);

  const handleCaptureSnapshot = () => {
    if (map && markerPosition) {
      const mapCanvas = map.getCanvas().toDataURL("image/png");
      setMapSnapshot(mapCanvas);
      setIsNewMythModalOpen(true); // Open the MythModal after capturing the snapshot
    }
  };

  return (
    <>
      <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />
      {markerPosition && <Marker position={markerPosition} map={map!} />}

      <MarkerModal
        onClose={() => setIsModalOpen(false)}
        position={markerPosition}
        isVisible={isModalOpen}
        modalPosition={modalPosition}
        onCaptureSnapshot={handleCaptureSnapshot} // Keep this if needed
      />

      <MythModal
        onClose={() => setIsNewMythModalOpen(false)}
        isVisible={isNewMythModalOpen}
        snapshot={mapSnapshot}
        markerPosition={markerPosition} // Pass the marker position to MythModal
        map={map!}
        actionData={actionData}
      />
    </>
  );
};

export default MapComponent;
