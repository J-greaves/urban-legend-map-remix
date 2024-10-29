import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import Marker from "./Marker";

interface MythModalProps {
  onClose: () => void;
  isVisible: boolean;
  snapshot: string | null;
  markerPosition: [number, number] | null; // New prop for marker position
  map: maplibregl.Map;
  actionData: any;
}

const MythModal: React.FC<MythModalProps> = ({
  onClose,
  isVisible,
  snapshot,
  markerPosition,
  map,
  actionData,
}) => {
  const smallMapRef = useRef<HTMLDivElement | null>(null); // Ref for the small map
  const smallMapRefMarker = useRef<maplibregl.Marker | null>(null); // Ref for the marker

  useEffect(() => {
    if (smallMapRef.current && markerPosition) {
      const smallMap = new maplibregl.Map({
        container: smallMapRef.current,
        style:
          "https://api.maptiler.com/maps/80adff1c-a2b7-43ca-98f1-3139ca1e9695/style.json?key=gEmLBDE8Bs39pXFQEk0Q",
        center: markerPosition, // Center the small map on the marker
        zoom: 15, // Set the desired zoom level for the small map
      });

      // Create a marker and add it to the small map
      smallMapRefMarker.current = new maplibregl.Marker()
        .setLngLat(markerPosition) // Set the marker position
        .addTo(smallMap); // Add marker to small map

      return () => {
        smallMap.remove(); // Cleanup on unmount
        if (smallMapRefMarker.current) {
          smallMapRefMarker.current.remove(); // Remove the marker on cleanup
        }
      };
    }
  }, [markerPosition]); // Re-run if markerPosition changes

  return (
    <div
      className={`fixed top-0 right-0 h-full border-l-2 border-slate-950 shadow-black bg-slate-800 shadow-lg w-[80%] max-w-[400px] p-6 transform transition-transform duration-1000 ease-in-out ${
        isVisible ? "translate-x-0" : "translate-x-full"
      }`}
      style={{ zIndex: 1000, willChange: "transform" }} // Inline z-index set to 1000
    >
      <div className="flex flex-col h-full justify-start items-start gap-4">
        {/* Small Map Display */}
        <div
          ref={smallMapRef}
          style={{ width: "100%", height: "200px", borderRadius: "8px" }}
        />
        {markerPosition && <Marker position={markerPosition} map={map} />}
        <form
          method="post"
          action="/?index"
          className="flex  flex-col gap-4 w-[100%] h-full"
        >
          {actionData?.success && (
            <div className="text-green-500">Submission successful!</div>
          )}
          {actionData?.error && (
            <div className="text-red-500">{actionData.error}</div>
          )}
          <div className="flex flex-col items-start gap-0">
            <label htmlFor="title">Title:</label>
            <input
              id="title"
              name="title"
              placeholder="Enter a title for your tale..."
              className="p-2 rounded border w-[100%]"
            />
          </div>
          <div className="flex flex-row gap-4">
            <select
              name="storyType"
              className="rounded border bg-slate-900 hover:cursor-pointer"
            >
              <option value="" disabled>
                Story type
              </option>
              <option value="myth">Myth</option>
              <option value="legend">Legend</option>
              <option value="folktale">Folktale</option>
              <option value="ghost story">Ghost Story</option>
              <option value="fairy tale">Fairy Tale</option>
              <option value="historic fact">Historic Fact</option>
              <option value="urban legend">Urban Legend</option>
              <option value="aliens">Aliens</option>
              <option value="songs">Songs</option>
              <option value="other">Other</option>
            </select>
            <p className="bg-slate-900 w-[25px] h-[25px] text-center rounded-full shadow-lg hover:bg-slate-700 transition duration-200 ease-in-out hover:cursor-pointer">
              i
            </p>
          </div>
          <label htmlFor="story">The Story:</label>
          <textarea
            id="story"
            name="story"
            placeholder="Write the story of your tale here..."
            className="p-2 rounded border w-[100%] h-full"
          ></textarea>
          <input
            type="hidden"
            name="latlong"
            value={JSON.stringify(markerPosition)}
          />
          <div className="flex flex-row gap-4 w-[100%]">
            <button
              type="submit"
              className="w-full py-2 bg-slate-900 text-white font-semibold rounded-lg border-2 border-slate-950 shadow-2xl hover:bg-slate-700 transition duration-200 ease-in-out"
            >
              Submit!
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 bg-slate-900 text-white font-semibold rounded-lg border-2 border-slate-950 shadow-2xl hover:bg-slate-700 transition duration-200 ease-in-out"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MythModal;
