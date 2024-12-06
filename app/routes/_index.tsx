import { ActionFunction, LoaderFunction, json } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { useState, useRef } from "react";
import MapComponent from "~/components/MapComponent";
import StoryModal from "~/components/StoryModal";
import Header from "~/components/Header";
import BurgerMenu from "~/components/BurgerMenu";
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
  imageUrl: string | null;
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
  const authorId = Number(formData.get("authorId"));
  const latlongString = formData.get("latlong");
  const latlong = JSON.parse(latlongString as string);
  const imageFile = formData.get("image") as File;

  if (
    typeof title !== "string" ||
    typeof location !== "string" ||
    typeof story_type !== "string" ||
    typeof story !== "string"
  ) {
    return json({ error: "Invalid form data" }, { status: 400 });
  }

  let imageUrl = null;
  if (imageFile) {
    const presignedResponse = await fetch(
      "http://localhost:3000/aws-s3/generate-presigned-url",
      {
        method: "POST",
        body: JSON.stringify({
          filename: imageFile.name,
          filetype: imageFile.type,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!presignedResponse.ok) {
      return json({ error: "Failed to get presigned URL" }, { status: 500 });
    }

    const { url } = await presignedResponse.json();

    const imageUploadResponse = await fetch(url, {
      method: "PUT",
      body: imageFile,
    });

    if (!imageUploadResponse.ok) {
      return json({ error: "Image upload failed!" }, { status: 500 });
    }

    imageUrl = `https://loremapper.s3.amazonaws.com/uploads/${imageFile.name}`;
  }

  const newStory = {
    title,
    location,
    story_type,
    story,
    authorId,
    latlong,
    imageUrl,
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

  const onDeleteStory = (storyId: number) => {
    const updatedSotries = stories.filter((story) => story.id !== storyId);
    setStories(updatedSotries);
  };

  return (
    <div className="relative flex flex-col h-screen overflow-hidden">
      <StoryModal
        isSMVisible={isSMVisible}
        setIsSMVisible={setIsSMVisible}
        story={story}
        onDeleteStory={onDeleteStory}
      />
      <BurgerMenu
        user={user}
        burgerOnOff={burgerOnOff}
        setBurgerOnOff={setBurgerOnOff}
      />
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
