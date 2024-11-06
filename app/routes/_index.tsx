import { ActionFunction, LoaderFunction, json } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import MapComponent from "~/components/MapComponent";
import StoryModal from "~/components/StoryModal";
import Header from "~/components/Header";
import { prisma } from "~/db/prisma.server";

export interface Story {
  id: number;
  title: string;
  location: string;
  story_type: string;
  story: string;
  latlong: string;
  createdAt: Date;
}

export interface LoaderData {
  stories: Story[];
}

//Fetches data from mysql, overly complex as I was having issues with coordinates format, tidy later!
export const loader: LoaderFunction = async () => {
  const stories = await prisma.stories.findMany();
  const parsedStories = stories.map((story) => {
    let coordinates: [number, number] | null = null;
    try {
      coordinates = JSON.parse(story.latlong);
      // Ensure it's a valid coordinate array
      if (
        Array.isArray(coordinates) &&
        coordinates.length === 2 &&
        typeof coordinates[0] === "number" &&
        typeof coordinates[1] === "number"
      ) {
        return { ...story, latlong: coordinates };
      }
    } catch {
      console.log("Invalid coordinates found for story:", story);
    }
    return { ...story, latlong: null };
  });

  return json({ stories: parsedStories });
};

//post new myth (with data from Myth Modal form) to mysql
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const title = formData.get("title");
  const location = formData.get("location");
  const story_type = formData.get("story_type");
  const story = formData.get("story");
  const latlong = formData.get("latlong");
  if (
    typeof title !== "string" ||
    typeof location !== "string" ||
    typeof story_type !== "string" ||
    typeof story !== "string" ||
    typeof latlong !== "string"
  ) {
    return json({ error: "Invalid form data" }, { status: 400 });
  }

  try {
    const newStory = await prisma.stories.create({
      data: {
        title,
        location,
        story_type,
        story,
        latlong,
      },
    });

    return json({ success: true, story: newStory });
  } catch (error) {
    console.error("Error creating story:", error);
    return json({ error: "Failed to create story" }, { status: 500 });
  }
};

export default function Index() {
  const [isSMVisible, setIsSMVisible] = useState(false);
  const [story, setStory] = useState<Story | null>(null);
  const [burgerOnOff, setBurgerOnOff] = useState(false);
  const actionData = useActionData();
  const LoaderData = useLoaderData<LoaderData>();
  const [stories, setStories] = useState(LoaderData.stories);
  const [allStories] = useState(LoaderData.stories);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const filterValue = e.target.value;

    if (filterValue === "all") {
      setStories(allStories);
    } else {
      const filteredStories = allStories.filter(
        (story) => story.story_type === filterValue
      );
      setStories(filteredStories);
    }
  };

  return (
    <div className="relative flex flex-col h-screen overflow-hidden">
      {/* Story Modal */}
      <StoryModal
        isSMVisible={isSMVisible}
        setIsSMVisible={setIsSMVisible}
        story={story}
      />
      <div
        className={`fixed top-0 left-0 w-[80%] max-w-[300px] h-full bg-gray-900 shadow-lg shadow-black border-r-2 border-slate-950 z-50 transform transition-transform duration-1000 ease-in-out ${
          burgerOnOff ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => {
            setBurgerOnOff(!burgerOnOff);
          }}
        >
          close
        </button>
      </div>
      {/* Map Component */}
      <div className="absolute top-0 left-0 w-full h-full z-0 ">
        <MapComponent
          actionData={actionData}
          stories={stories}
          isSMVisible={isSMVisible}
          setIsSMVisible={setIsSMVisible}
          setStory={setStory}
          setIsHeaderVisible={setIsHeaderVisible}
          setStories={setStories}
        />
      </div>

      {/* Header */}
      <div
        className={`fixed top-0 left-0 h-20 w-full bg-gray-900 shadow-xl z-40 transition-transform transform duration-1000 ease-in-out ${
          isHeaderVisible ? "translate-y-0" : "-translate-y-full"
        } shadow-lg border-b-2 border-slate-950`}
      >
        <Header
          handleFilterChange={handleFilterChange}
          burgerOnOff={burgerOnOff}
          setBurgerOnOff={setBurgerOnOff}
          isHeaderVisible={isHeaderVisible}
          setIsHeaderVisible={setIsHeaderVisible}
        />
      </div>
    </div>
  );
}
