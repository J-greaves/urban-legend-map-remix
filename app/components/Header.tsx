import { useStytchUser } from "@stytch/react";

interface HeaderProps {
  handleFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  burgerOnOff: boolean;
  setBurgerOnOff: React.Dispatch<React.SetStateAction<boolean>>;
  isHeaderVisible: boolean;
  setIsHeaderVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<HeaderProps> = ({
  handleFilterChange,
  burgerOnOff,
  setBurgerOnOff,
  isHeaderVisible,
  setIsHeaderVisible,
}) => {
  const { user } = useStytchUser();
  return (
    <div className="flex flex-col items-center h-full justify-center">
      {/* The sliding header */}
      <div className="flex flex-row justify-center items-center w-full">
        {/* Burger button */}
        <button
          onClick={() => setBurgerOnOff(!burgerOnOff)}
          className="bg-white hover:bg-opacity-50 rounded sm:ml-4 ml-2 p-2 sm:w-15 sm:h-15 w-8 h-8 flex flex-col justify-between items-center space-y-1"
        >
          <div className="w-6 h-1 bg-black rounded"></div>
          <div className="w-6 h-1 bg-black rounded"></div>
          <div className="w-6 h-1 bg-black rounded"></div>
        </button>
        <img className="sm:ml-8 ml-2 sm:w-[300px] w-[200px]" src="/logo.png" />
        {/* Filter Dropdown */}
        <div className="flex flex-row justify-evenly w-[100%]">
          <div className="flex sm:flex-row flex-col sm:gap-4 gap-1 sm:text-base text-sm ml-2">
            <p>Story Type:</p>
            <select
              name="story_type"
              className="rounded border bg-slate-900 hover:cursor-pointer w-[90%]"
              onChange={handleFilterChange}
            >
              <option value="" disabled>
                Story type
              </option>
              <option value="all">All</option>
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
            <p className="sm:pl-4">Logged in user: {user?.emails[0].email}</p>
          </div>
        </div>
      </div>

      {/* toggle header visibility button*/}
      <div
        className={`absolute sm:bottom-[-50px] bottom-[-40px] left-1/2 transform -translate-x-1/2 w-auto h-auto border-l-2 border-b-2 border-r-2 border-slate-950 z-50 rounded text-center hover:cursor-pointer p-1 transition-opacity duration-1000 ease-in-out ${
          isHeaderVisible ? "bg-gray-900 opacity-100" : "bg-gray-900 opacity-50"
        }`}
        onClick={() => setIsHeaderVisible(!isHeaderVisible)}
      >
        {isHeaderVisible ? (
          <img className="p-1 sm:w-10 w-8" src="/arrow-up.png" />
        ) : (
          <img className="p-1 sm:w-10 w-8" src="/arrow-down.png" />
        )}
      </div>
    </div>
  );
};

export default Header;
