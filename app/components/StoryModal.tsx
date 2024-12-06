import React, { useEffect, useRef, useState } from "react";
import { Story } from "~/routes/_index";
import { iconMap } from "./MapComponent";
import { useUser } from "~/contexts/UserContext";

interface StoryModalProps {
  isSMVisible: boolean;
  setIsSMVisible: React.Dispatch<React.SetStateAction<boolean>>;
  story: Story | null;
  onDeleteStory: (storyId: number) => void;
}

interface GoogleImage {
  link: string;
  title: string;
}

const StoryModal: React.FC<StoryModalProps> = ({
  isSMVisible,
  setIsSMVisible,
  story,
  onDeleteStory,
}) => {
  const [images, setImages] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false); // New state for loading
  const modalContentRef = useRef<HTMLDivElement | null>(null);
  const user = useUser();

  useEffect(() => {
    if (isSMVisible && modalContentRef.current) {
      modalContentRef.current.scrollTop = 0;
    }
  }, [isSMVisible]);

  let icon;

  if (story) {
    icon = iconMap[story.story_type];
  } else {
    icon = undefined;
  }

  async function fetchImages(query: string) {
    const response = await fetch(
      `/googleImages?query=${encodeURIComponent(query)}`
    );
    const data = await response.json();
    console.log(data);
    if (data.error) {
      console.error(data.error);
    } else {
      console.log("Fetched images:", data);
      setImages(data);
    }
  }

  async function deleteStory(storyId: number) {
    setIsDeleting(true);
    try {
      const response = await fetch(`http://localhost:3000/stories/${storyId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Story deleted successfully:", result.message);
        setIsSMVisible(false); // Close the modal
        onDeleteStory(storyId); // Trigger parent component to update map markers
      } else {
        console.error("Failed to delete story:", result.message);
      }
    } catch (error) {
      console.error("Error while deleting story:", error);
    } finally {
      setIsDeleting(false); // Reset loading state
    }
  }

  function handleSearch(query: string) {
    fetchImages(query);
  }

  return (
    <div
      className={`fixed top-0  left-0 w-full h-full bg-transparent transition-transform duration-1000 ease-in-out transform ${
        isSMVisible ? "translate-y-0" : "-translate-y-full"
      }`}
      style={{ zIndex: 1000 }}
    >
      <div
        className={`absolute top-0 left-0 w-full h-full flex items-center justify-center `}
      >
        <div
          ref={modalContentRef}
          className="bg-slate-950 bg-opacity-90 p-8 rounded shadow-lg w-[80%] h-[80%] gap-4 flex flex-col overflow-y-auto"
        >
          {story?.imageUrl ? (
            <img
              src={story.imageUrl}
              className="w-[150px] h-[150px] rounded-md hover:cursor-pointer transform hover:scale-105 transition-transform duration-3000"
            />
          ) : null}
          <div className="flex flex-row">
            <h2 className="text-3xl font-semibold text-white">
              {story?.title ?? null}
            </h2>
            {user.loggedInUser?.id === story?.authorId ? (
              isDeleting ? (
                <p className="ml-auto text-white animate-pulse">Deleting...</p>
              ) : (
                <img
                  src="Delete-button.svg"
                  onClick={() => deleteStory(story!.id)}
                  className="place-self-end justify-self-end ml-auto w-[32px] hover:cursor-pointer transform hover:scale-105 transition-transform duration-3000"
                  alt="Delete story"
                />
              )
            ) : null}
          </div>
          <div className="flex flex-row items-center gap-4">
            <img src={icon} className="w-[35px] justify-self-center mb-1" />
            <h3>
              {story
                ? story.story_type.charAt(0).toUpperCase() +
                  story.story_type.slice(1)
                : null}
            </h3>
          </div>
          <h3 className="text-xl font-bold text-white">
            {story?.location ?? null}
          </h3>

          <p className="text-lg font-medium text-white max-w-[1000px]">
            {story?.story ?? null}
          </p>
          <div className="flex flex-col items-start gap-4">
            <button
              onClick={() => {
                handleSearch(`${story?.title}`);
              }}
              className="bg-white rounded text-black px-2"
            >
              Show Images
            </button>
            <div className="flex flex-row flex-wrap gap-2">
              {images
                .filter((image: GoogleImage, index, self) => {
                  return (
                    index ===
                    self.findIndex((i: GoogleImage) => i.title === image.title)
                  );
                })
                .map((image: GoogleImage) => {
                  return (
                    <a
                      key={image.link}
                      href={image.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={image.link}
                        alt={image.title}
                        className="w-[125px] h-[125px]"
                      />
                    </a>
                  );
                })}
            </div>
            <a
              href={`https://www.google.com/search?q=${encodeURIComponent(
                story?.title + " " + story?.story_type || "404 - not found"
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="bg-white rounded text-black px-2">
                Google it
              </button>
            </a>
          </div>
          <button
            onClick={() => {
              setIsSMVisible(false);
              setImages([]);
            }}
            className="mt-4 bg-red-500 text-white py-2 px-4 rounded w-[50%] absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoryModal;
