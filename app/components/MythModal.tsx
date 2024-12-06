import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useFetcher } from "@remix-run/react";
import { Story } from "~/routes/_index";
import { useUser } from "~/contexts/UserContext";

interface MythModalProps {
  isVisible: boolean;
  markerPosition: [number, number] | null;
  actionData: any;
  setIsNewMythModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setStoryAdded: React.Dispatch<React.SetStateAction<Story | undefined>>;
}

interface FetcherData {
  story: Story;
}

const MythModal: React.FC<MythModalProps> = ({
  isVisible,
  markerPosition,
  actionData,
  setIsNewMythModalOpen,
  setStoryAdded,
}) => {
  const smallMapRef = useRef<HTMLDivElement | null>(null);
  const smallMapRefMarker = useRef<maplibregl.Marker | null>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const storyRef = useRef<HTMLTextAreaElement>(null);
  const storyTypeRef = useRef<HTMLSelectElement>(null);
  const locationRef = useRef<HTMLInputElement>(null);
  const fetcher = useFetcher<FetcherData>();
  const loggedInUser = useUser();

  //MapLibre small map for New Myth Modal initialisation
  useEffect(() => {
    if (smallMapRef.current && markerPosition) {
      const smallMap = new maplibregl.Map({
        container: smallMapRef.current,
        style:
          "https://api.maptiler.com/maps/80adff1c-a2b7-43ca-98f1-3139ca1e9695/style.json?key=gEmLBDE8Bs39pXFQEk0Q",
        center: markerPosition,
        zoom: 15,
      });

      smallMapRefMarker.current = new maplibregl.Marker()
        .setLngLat(markerPosition)
        .addTo(smallMap);

      return () => {
        smallMap.remove();
        if (smallMapRefMarker.current) {
          smallMapRefMarker.current.remove();
        }
      };
    }
  }, [markerPosition]);

  useEffect(() => {
    setIsNewMythModalOpen(false);
    if (fetcher.data) setStoryAdded(fetcher.data.story);
    if (titleRef.current) titleRef.current.value = "";
    if (locationRef.current) locationRef.current.value = "";
    if (storyRef.current) storyRef.current.value = "";
    if (storyTypeRef.current) storyTypeRef.current.value = "";
  }, [fetcher.data]);
  return (
    <div
      className={`z-100 fixed top-0 right-0 h-full border-l-2 border-slate-950 shadow-black bg-slate-800 shadow-lg w-[80%] max-w-[400px] p-6 transform transition-transform duration-1000 ease-in-out ${
        isVisible ? "translate-x-0" : "translate-x-full"
      }`}
      style={{ zIndex: 999, willChange: "transform" }}
    >
      {loggedInUser.loggedInUser ? (
        <div className="flex flex-col h-full justify-start items-start gap-4">
          {/* Small Map Display */}
          <div
            ref={smallMapRef}
            style={{ width: "100%", height: "200px", borderRadius: "8px" }}
          />
          {/*Submit new myth form*/}
          <fetcher.Form
            method="post"
            action="/?index"
            className="flex  flex-col gap-4 w-[100%] h-full"
            encType="multipart/form-data"
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
                ref={titleRef}
                className="p-2 rounded border w-[100%]"
                required
              />
            </div>
            <div className="flex flex-col items-start gap-0">
              <label htmlFor="title">Location:</label>
              <input
                id="location"
                name="location"
                placeholder="Enter street, town, city etc..."
                ref={locationRef}
                className="p-2 rounded border w-[100%]"
                required
              />
            </div>
            <div className="flex flex-row gap-4">
              <select
                name="story_type"
                ref={storyTypeRef}
                className="rounded border bg-slate-900 hover:cursor-pointer"
                required
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
                <option value="song">Songs</option>
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
              ref={storyRef}
              className="p-2 rounded border w-[100%] h-full"
              required
            ></textarea>
            <div className="flex flex-col items-start gap-0">
              <label htmlFor="image">Upload Image (optional):</label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                className="p-2 rounded border w-[100%]"
              />
            </div>
            <input
              type="hidden"
              name="latlong"
              value={JSON.stringify(markerPosition)}
            />
            <input
              type="hidden"
              name="authorId"
              value={loggedInUser.loggedInUser.id}
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
                onClick={() => {
                  setIsNewMythModalOpen(false);
                }}
                className="w-full py-2 bg-slate-900 text-white font-semibold rounded-lg border-2 border-slate-950 shadow-2xl hover:bg-slate-700 transition duration-200 ease-in-out"
              >
                Close
              </button>
            </div>
          </fetcher.Form>
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <div className="text-center text-lg w-full">
            You must be logged in to add a story
          </div>
        </div>
      )}
    </div>
  );
};

export default MythModal;
