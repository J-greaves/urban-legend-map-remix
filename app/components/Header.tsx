import { useStytchUser } from "@stytch/react";
import { LogOutButton } from "./LogOutButton";
import { useNavigate } from "@remix-run/react";

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
  const navigate = useNavigate();
  return (
    <div className="flex flex-col h-full justify-center text-creamyText">
      {/* The sliding header */}
      <div className="flex flex-row items-center w-full gap-1">
        <div className="flex flex-row items-center justify-start">
          {/* Burger button */}
          <button
            onClick={() => setBurgerOnOff(!burgerOnOff)}
            className="bg-white  hover:bg-opacity-50 transition duration-300 ease-in-out rounded sm:ml-8 ml-4 sm:p-2 p-0.5 sm:w-10 sm:h-10 w-6 h-8 flex flex-col justify-center items-center space-y-1"
          >
            <div className="sm:w-6 w-4 h-1 bg-black rounded"></div>
            <div className="sm:w-6 w-4 h-1 bg-black rounded"></div>
            <div className="sm:w-6 w-4 h-1 bg-black rounded"></div>
          </button>
          {/* Logo */}
          <img
            className="sm:ml-8 ml-2 max-h-[80px] overflow-hidden"
            src="/logo.png"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="flex flex-row sm:gap-4 gap-1 sm:text-base text-sm sm:mr-6 ml-auto w-auto items-center">
          <div className="flex flex-row">
            <p className="sm:block hidden mr-4">Type:</p>
            <select
              name="story_type"
              className="rounded border bg-slate-900 hover:cursor-pointer w-[80%]"
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
          </div>
          {user ? (
            <p className="md:block hidden sm:mr-4">
              Logged in user:
              <br /> {user.emails[0].email}
            </p>
          ) : null}

          {user ? (
            <LogOutButton />
          ) : (
            <button
              className="sm:rounded sm:block hidden text-black sm:p-1 p-0.5 sm:mx-4 sm:text-base sm:font-normal font-bold text-xs rounded-lg w-auto sm:max-w-[100px] max-w-[40px]"
              onClick={() => {
                navigate("/login");
              }}
            >
              <img src="login.png" className="max-w-[40px]" />
            </button>
          )}
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
