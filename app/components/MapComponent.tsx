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
  const [isNewMythModalOpen, setIsNewMythModalOpen] = useState(false);
  const [storyAdded, setStoryAdded] = useState<Story | undefined>();
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
        antialias: true,
      });

      initialisedMap.on("load", () => {
        let labelLayerId;

        initialisedMap.addSource("openmaptiles", {
          url: "https://api.maptiler.com/tiles/v3/tiles.json?key=gEmLBDE8Bs39pXFQEk0Q",
          type: "vector",
        });

        initialisedMap.addSource("maptiler-terrain", {
          type: "raster-dem",
          url: "https://api.maptiler.com/tiles/terrain-rgb/tiles.json?key=gEmLBDE8Bs39pXFQEk0Q",
          tileSize: 256,
        });

        initialisedMap.setTerrain({
          source: "maptiler-terrain",
          exaggeration: 1.5,
        });

        initialisedMap.setLight({
          anchor: "viewport",
          color: "white",
          intensity: 0.7,
        });

        initialisedMap.addLayer(
          {
            id: "3d-buildings",
            source: "openmaptiles",
            "source-layer": "building",
            type: "fill-extrusion",
            minzoom: 15,
            paint: {
              "fill-extrusion-color": [
                "interpolate",
                ["linear"],
                ["get", "render_height"],
                0,
                "#d0d0d0",
                100,
                "#a8d0e6",
                300,
                "#374785",
              ],
              "fill-extrusion-height": [
                "interpolate",
                ["exponential", 1.5],
                ["zoom"],
                15,
                0,
                16,
                ["get", "render_height"],
              ],
              "fill-extrusion-base": [
                "case",
                [">=", ["get", "zoom"], 16],
                ["get", "render_min_height"],
                0,
              ],
              "fill-extrusion-opacity": 0.9,
              "fill-extrusion-vertical-gradient": true,
            },
          },
          labelLayerId
        );
      });

      initialisedMap.on("click", (event) => {
        const lngLat: [number, number] = [event.lngLat.lng, event.lngLat.lat];
        setMarkerPosition(lngLat);

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
        setIsNewMythModalOpen(false);
      });

      setMap(initialisedMap);

      return () => initialisedMap.remove();
    }
  }, []);

  //place markers on map
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

  //add story to map
  useEffect(() => {
    if (storyAdded) {
      alert(
        `New Story Added:\nTitle: ${storyAdded.title}\nStory: ${storyAdded.story}`
      );
      setStories([...stories, storyAdded]);
    }

    setIsNewMythModalOpen(false);
  }, [storyAdded]);

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
        isVisible={isNewMythModalOpen}
        markerPosition={markerPosition}
        actionData={actionData}
        setIsNewMythModalOpen={setIsNewMythModalOpen}
        setStoryAdded={setStoryAdded}
      />
    </>
  );
};

export default MapComponent;
