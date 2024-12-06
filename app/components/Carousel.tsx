import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import type { Story } from "~/routes/_index";
import { iconMap } from "./MapComponent";

interface CarouselProps {
  favouriteStories: Story[];
  type: string;
}

const CenterMode: React.FC<CarouselProps> = ({ favouriteStories, type }) => {
  const settings = {
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "60px",
    slidesToShow: 3,
    speed: 500,
  };

  return (
    <div className="mb-8 font-playfair ">
      <div
        className={`slider-container max-w-[920px] border-2 border-black rounded-xl shadow-lg bg-no-repeat bg-center bg-cover bg-fixed ${
          type === "fave" ? "bg-[url('wave.svg')]" : "bg-[url('wave2.svg')]"
        }`}
      >
        {/* This is the container for the carousel */}
        <Slider {...settings}>
          {favouriteStories.map((story) => (
            <div
              key={story.id}
              className="content flex flex-col text-creamyText  overflow-hidden shadow-lg rounded-t-full transform hover:scale-105 transition-transform duration-1000"
            >
              <div className="flex flex-col gap-3 p-2 pt-8 h-[250px] rounded-t-full bg-slate-900 bg-opacity-80 border-black border-[1px] hover:bg-opacity-100 hover:cursor-pointer">
                <img
                  src={iconMap[story.story_type]}
                  className="h-[20%] w-[20%] place-self-center"
                />
                <p className="text-md text-gray-300">{story.story_type}</p>
                <h3 className="text-xl font-semibold">{story.title}</h3>
                <p className="text-md text-gray-300">{story.location}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default CenterMode;
