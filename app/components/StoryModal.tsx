import React, { useEffect, useRef } from "react";
import { Story } from "~/routes/_index";
import { iconMap } from "./MapComponent";

interface StoryModalProps {
  isSMVisible: boolean;
  setIsSMVisible: React.Dispatch<React.SetStateAction<boolean>>;
  story: Story | null;
}

const StoryModal: React.FC<StoryModalProps> = ({
  isSMVisible,
  setIsSMVisible,
  story,
}) => {
  const modalContentRef = useRef<HTMLDivElement | null>(null);
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
          className="bg-slate-950 opacity-90 p-8 rounded shadow-lg w-[80%] h-[80%] gap-4 flex flex-col overflow-y-auto"
        >
          <h2 className="text-3xl font-semibold text-white">
            {story?.title ?? null}
          </h2>
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
          <button
            onClick={() => setIsSMVisible(false)}
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
