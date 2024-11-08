import React, { useEffect, useState, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import MythModal from "./MythModal";
import { Story } from "~/routes/_index";

interface MapComponentProps {
  actionData: any;
  stories: Story[];
  isSMVisible: boolean;
  setIsSMVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setStory: React.Dispatch<React.SetStateAction<Story | null>>;
  setIsHeaderVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setStories: React.Dispatch<React.SetStateAction<Story[]>>;
}

export const iconMap: { [key: string]: string } = {
  myth: "/zeus.png",
  legend: "/history.png",
  folktale: "/leprechaun.png",
  "ghost story": "/ghost.png",
  "fairy tale": "/frog.png",
  "historic fact": "/shield.png",
  "urban legend": "/buildings.png",
  aliens: "/alien.png",
  song: "/vynil.png",
};

const MapComponent: React.FC<MapComponentProps> = ({
  actionData,
  stories,
  isSMVisible,
  setIsSMVisible,
  setStory,
  setIsHeaderVisible,
  setStories,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<maplibregl.Map | null>(null);
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewMythModalOpen, setIsNewMythModalOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const markersRef = useRef<maplibregl.Marker[]>([]);

  //MapLibre map initialisation
  useEffect(() => {
    if (mapContainerRef.current) {
      const initialisedMap = new maplibregl.Map({
        container: mapContainerRef.current,
        style:
          "https://api.maptiler.com/maps/80adff1c-a2b7-43ca-98f1-3139ca1e9695/style.json?key=gEmLBDE8Bs39pXFQEk0Q",
        center: [0, 20],
        zoom: 2,
        minZoom: 2,
      });

      initialisedMap.on("click", (event) => {
        setIsModalOpen(false);
        const lngLat: [number, number] = [event.lngLat.lng, event.lngLat.lat];
        setMarkerPosition(lngLat);
        const { x, y } = initialisedMap.project(lngLat);
        setModalPosition({ top: y, left: x });
        setIsModalOpen(true);

        const newPopup = new maplibregl.Popup({
          closeOnClick: true,
          closeOnMove: true,
        }).setHTML(
          `<div style="text-align: center;">
            <h1 class="text-black text-base font-semibold mt-0">Add a myth to <br> this location?</h1>
            <button id="addMythButton" class="w-8 h-8 mt-1 bg-green-500 text-xl text-black rounded-full shadow-lg hover:bg-green-600 focus:outline-none">
              +
            </button>
          </div>`
        );
        newPopup.setLngLat(lngLat).addTo(initialisedMap);

        newPopup
          .getElement()
          .querySelector("#addMythButton")
          ?.addEventListener("click", (e) => {
            e.preventDefault();
            setIsNewMythModalOpen(true);
            setIsHeaderVisible(false);
          });
      });

      initialisedMap.on("move", () => {
        setIsModalOpen(false);
        setIsNewMythModalOpen(false);
      });

      setMap(initialisedMap);

      return () => initialisedMap.remove();
    }
  }, []);

  useEffect(() => {
    if (!map) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    const colorMap: { [key: string]: string } = {
      myth: "#022fb5",
      legend: "#0b5706",
      folktale: "#eaff2b",
      "ghost story": "#840c9c",
      "fairy tale": "#f768e0",
      "historic fact": "#d41313",
      "urban legend": "#7c7d7d",
      aliens: "#17eb00",
      song: "#fa8b02",
    };

    //Map Markers
    stories.forEach((story) => {
      if (story.latlong && Array.isArray(story.latlong)) {
        const [lng, lat] = story.latlong;
        const color = colorMap[story.story_type] || "#000000";
        const icon = iconMap[story.story_type];

        const marker = new maplibregl.Marker({ color: color })
          .setLngLat([lng, lat])
          .addTo(map);

        markersRef.current.push(marker);

        marker.getElement().addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();

          // Myth Popup
          const newPopup = new maplibregl.Popup({
            closeOnClick: true,
            closeButton: true,
            closeOnMove: true,
            maxWidth: "180px",
          }).setLngLat([lng, lat]).setHTML(`
          <div class="flex justify-center">
            <img src=${icon} class="w-[35px] justify-self-center mb-1"/>
          </div>
          <p class="text-black font-medium text-sm text-center mb-1">${
            story.story_type.charAt(0).toUpperCase() + story.story_type.slice(1)
          }</p>
          <h3 class="text-black font-semibold text-base mb-1">${
            story.title
          }</h3>
          <button id="read-more" class="focus:outline-none text-blue-500 w-full block hover:underline text-right">Read more...</button>
        `);

          newPopup.addTo(map);

          const readMoreButton = newPopup
            .getElement()
            ?.querySelector("#read-more");
          if (readMoreButton) {
            readMoreButton.addEventListener("click", (e) => {
              setStory(story);
              setIsSMVisible((prev) => !prev);
            });
          } else {
            console.error("Read more button not found in the popup.");
          }
        });
      } else {
        console.error(`Invalid latlong for story ID ${story.id}`);
      }
    });
  }, [stories, map]);

  return (
    <>
      {/* Map Container */}
      <div
        ref={mapContainerRef}
        style={{
          width: "100%",
          height: "100%",
          zIndex: 1,
        }}
      />
      {/* Myth Modal */}
      <MythModal
        onClose={() => setIsNewMythModalOpen(false)}
        isVisible={isNewMythModalOpen}
        markerPosition={markerPosition}
        map={map}
        actionData={actionData}
        stories={stories}
        setStories={setStories}
      />
    </>
  );
};

export default MapComponent;
