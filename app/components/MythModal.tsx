import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useFetcher } from "@remix-run/react";
import { Story } from "~/routes/_index";

interface MythModalProps {
  onClose: () => void;
  isVisible: boolean;
  markerPosition: [number, number] | null;
  map: maplibregl.Map | null;
  actionData: any;
  stories: Story[];
  setStories: React.Dispatch<React.SetStateAction<Story[]>>;
}

interface StoryData {
  success?: boolean;
  story?: {
    id: number;
    title: string;
    location: string;
    story_type: string;
    story: string;
    latlong: string;
    createdAt: Date;
  };
  error?: string;
}

const MythModal: React.FC<MythModalProps> = ({
  onClose,
  isVisible,
  markerPosition,
  map,
  actionData,
  stories,
  setStories,
}) => {
  const smallMapRef = useRef<HTMLDivElement | null>(null);
  const smallMapRefMarker = useRef<maplibregl.Marker | null>(null);
  const fetcher = useFetcher<StoryData>();
  const titleRef = useRef<HTMLInputElement>(null);
  const storyRef = useRef<HTMLTextAreaElement>(null);
  const storyTypeRef = useRef<HTMLSelectElement>(null);

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

  //Optimistcally render new myth and alert user (change alert to modal at some point)
  useEffect(() => {
    if (fetcher.data?.success && fetcher.data.story) {
      const story = fetcher.data.story;
      alert(`New Story Added:\nTitle: ${story.title}\nStory: ${story.story}`);
      const newStory: Story = {
        id: story.id,
        title: story.title,
        location: story.location,
        story_type: story.story_type,
        story: story.story,
        latlong: JSON.parse(story.latlong),
        createdAt: story.createdAt,
      };
      setStories([...stories, newStory]);
    }
    if (titleRef.current) titleRef.current.value = "";
    if (storyRef.current) storyRef.current.value = "";
    if (storyTypeRef.current) storyTypeRef.current.value = "";

    onClose();
  }, [fetcher.data]);

  return (
    <div
      className={`z-100 fixed top-0 right-0 h-full border-l-2 border-slate-950 shadow-black bg-slate-800 shadow-lg w-[80%] max-w-[400px] p-6 transform transition-transform duration-1000 ease-in-out ${
        isVisible ? "translate-x-0" : "translate-x-full"
      }`}
      style={{ zIndex: 999, willChange: "transform" }}
    >
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
            />
          </div>
          <div className="flex flex-col items-start gap-0">
            <label htmlFor="title">Location:</label>
            <input
              id="location"
              name="location"
              placeholder="Enter street, town, city etc..."
              ref={titleRef}
              className="p-2 rounded border w-[100%]"
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
        </fetcher.Form>
      </div>
    </div>
  );
};

export default MythModal;
