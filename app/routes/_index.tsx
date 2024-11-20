import { ActionFunction, LoaderFunction, json } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import MapComponent from "~/components/MapComponent";
import StoryModal from "~/components/StoryModal";
import Header from "~/components/Header";
import { Link } from "@remix-run/react";
import { useStytchUser } from "@stytch/react";

export interface Story {
  id: number;
  title: string;
  location: string;
  story_type: string;
  story: string;
  latlong: string;
  createdAt: Date;
  authorId: number | null;
}

export interface LoaderData {
  stories: Story[];
}

//Fetches story data from mysql via nestJS
export const loader: LoaderFunction = async () => {
  const response = await fetch("http://localhost:3000/stories", {
    method: "GET",
  });

  if (!response.ok) {
    throw new Response("Failed to load stories", { status: response.status });
  }

  const stories = await response.json();

  return json({ stories });
};

//post new myth (with data from Myth Modal form) to mysql via nestJS
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const title = formData.get("title");
  const location = formData.get("location");
  const story_type = formData.get("story_type");
  const story = formData.get("story");
  const latlongString = formData.get("latlong");
  const latlong = JSON.parse(latlongString as string);
  if (
    typeof title !== "string" ||
    typeof location !== "string" ||
    typeof story_type !== "string" ||
    typeof story !== "string"
  ) {
    return json({ error: "Invalid form data" }, { status: 400 });
  }

  const newStory = {
    title,
    location,
    story_type,
    story,
    latlong,
    authorId: null,
  };

  try {
    const response = await fetch("http://localhost:3000/stories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newStory),
    });
    const story = await response.json();
    return json({ success: true, story: story });
  } catch (error) {
    return json({ error: "Failed to create story" }, { status: 500 });
  }
};

//post new myth (with data from Myth Modal form) to mysql via prisma
// export const action: ActionFunction = async ({ request }) => {
//   const formData = await request.formData();
//   const title = formData.get("title");
//   const location = formData.get("location");
//   const story_type = formData.get("story_type");
//   const story = formData.get("story");
//   const latlong = formData.get("latlong");
//   if (
//     typeof title !== "string" ||
//     typeof location !== "string" ||
//     typeof story_type !== "string" ||
//     typeof story !== "string" ||
//     typeof latlong !== "string"
//   ) {
//     return json({ error: "Invalid form data" }, { status: 400 });
//   }

//   try {
//     const newStory = await prisma.stories.create({
//       data: {
//         title,
//         location,
//         story_type,
//         story,
//         latlong,
//       },
//     });

//     return json({ success: true, story: newStory });
//   } catch (error) {
//     console.error("Error creating story:", error);
//     return json({ error: "Failed to create story" }, { status: 500 });
//   }
// };

export default function Index() {
  const { user } = useStytchUser();
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
      <StoryModal
        isSMVisible={isSMVisible}
        setIsSMVisible={setIsSMVisible}
        story={story}
      />
      {/* burger menu*/}
      <div
        className={`flex text-creamyText ]  text-4xl items-start flex-col gap-8 pl-10 pt-4 fixed top-0 left-0 w-[80%] max-w-[300px] h-full bg-gray-900 shadow-lg shadow-black border-r-2 border-slate-950 z-50 transform transition-transform duration-1000 ease-in-out ${
          burgerOnOff ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          className="place-self-end bg-gray-900 p-1.5 mr-3 rounded-xl border hover:bg-gray-700 transition duration-300 ease-in-out"
          onClick={() => {
            setBurgerOnOff(!burgerOnOff);
          }}
        >
          <img src="close.png" className="w-[32px]" />
        </button>
        {user ? (
          <div className="h-full">
            <div className="transform hover:scale-105 transition-transform duration-200">
              <li>
                <Link to="/login">login</Link>
              </li>
            </div>
            <p className="place-self-end self-end justify-self-end mt-auto text-[18px]">
              Logged in user:
              <br /> {user.emails[0].email}
            </p>
          </div>
        ) : null}
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
          user={user}
        />
      </div>
    </div>
  );
}
