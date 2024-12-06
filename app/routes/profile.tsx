import { useUser } from "~/contexts/UserContext";
import { Link } from "@remix-run/react";
import { checkIfUserExists } from "~/db/api";
import { useStytchUser } from "@stytch/react";
import { useEffect, useState } from "react";
import CenterMode from "~/components/Carousel";
import { useNavigate } from "@remix-run/react";
import { getUserStories } from "~/db/api";

const Profile = () => {
  const { loggedInUser, setLoggedInUser } = useUser();
  const { user } = useStytchUser();
  const [submittedStories, setSubmittedStories] = useState([]); // Initially empty
  const [favouritedStories, setFavouritedStories] = useState([]); // Initially empty
  const [loading, setLoading] = useState(true); // Initial loading state

  const navigate = useNavigate();

  // Fetch data once user info is available
  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const email = user.emails[0].email;
        const userData = await checkIfUserExists(email);

        const newUser = {
          id: userData.user.id,
          username: userData.user.userName,
          email: userData.user.email,
          avatarUrl: userData.user.avatarUrl,
          memberSince: userData.user.createdAt,
        };

        setLoggedInUser(newUser);

        // Fetch stories only after loggedInUser is set
        const stories = await getUserStories(newUser.id);
        if (stories) {
          setFavouritedStories(stories.favoriteStories);
          setSubmittedStories(stories.submittedStories);
        } else {
          console.log("Failed to fetch user stories");
        }
      }
      setLoading(false); // Mark loading as complete
    };

    // Only run this if the user is available and the logged-in user is not set
    if (user) {
      fetchData();
    }
  }, [loggedInUser, user, setLoggedInUser]);

  // If loading, return a loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-300">Loading...</p>
      </div>
    );
  }

  // If no user is logged in or fetched
  if (!loggedInUser && !user) {
    return (
      <div>
        No user found. Please{" "}
        <Link to="/login">
          <span className="text-blue-600 underline">log in.</span>
        </Link>
      </div>
    );
  }

  let formattedDate;
  if (loggedInUser) {
    const date = new Date(loggedInUser.memberSince);
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    formattedDate = new Intl.DateTimeFormat("en-GB", options).format(date);
  }

  return (
    <main className="bg-gray-900 h-full w-full flex flex-col items-center">
      <header className="w-full h-20 bg-gray-900 flex flex-row items-center">
        <button
          className="h-[60%] w-auto m-4 bg-gray-900 p-1.5 mr-3 rounded-xl border hover:bg-gray-700 transition duration-300 ease-in-out"
          onClick={() => navigate("/")}
        >
          <img src="close.png" className="h-full w-auto" />
        </button>
        <img
          src="logo.png"
          className="sm:h-full h-[80%] w-auto ml-6 sm:mr-4 mr-2"
        />
      </header>
      <section className=" sm:w-[90%] w-[100%] h-full p-8 text-black">
        <div className="flex flex-row md:gap-8 sm:gap-4 gap-2 border-black border-2 p-4 rounded-xl max-w-[920px] bg-[url('wave2.svg')] bg-no-repeat bg-center bg-cover bg-fixed">
          <img
            className="w-[325px] h-[325px] object-cover rounded-full overflow-hidden shadow-black shadow-md flex-shrink min-w-[100px]"
            src={loggedInUser?.avatarUrl}
            alt={`${loggedInUser?.username}'s avatar`}
          />
          <div className="flex flex-col font-playfair text-creamyText justify-end text-center text-[120%] gap-4 sm:ml-6 ml-2">
            <div className="flex sm:flex-row flex-col w-full gap-2">
              <div className=" sm:h-14 h-10 sm:pl-0 pl-2 sm:justify-end pr-4 items-center flex bg-slate-950 rounded-xl border-black border-2 border-solid">
                <h1 className="sm:pl-4 pl-2">Username:</h1>
              </div>
              <div className=" sm:h-14 h-10 items-center flex text-left sm:pl-4 pl-2 bg-slate-950 rounded-xl border-black border-2 border-solid">
                <h1 className="sm:pr-4 pr-2">{loggedInUser?.username}</h1>
              </div>
            </div>
            <div className="flex sm:flex-row flex-col w-full gap-2">
              <div className=" sm:h-14 h-10 sm:pl-0 pl-2 sm:justify-end pr-4 items-center flex bg-slate-950 rounded-xl border-black border-2 border-solid">
                <h2 className="sm:pl-4 pl-2">Email:</h2>
              </div>
              <div className=" sm:h-14 h-10 items-center flex text-left sm:pl-4 pl-2 bg-slate-950 rounded-xl border-black border-2 border-solid">
                <h2 className="sm:pr-4 pr-2">{loggedInUser?.email}</h2>
              </div>
            </div>
            <div className="flex sm:flex-row flex-col w-full gap-2">
              <div className=" sm:h-14 h-10 sm:pl-0 pl-2 sm:justify-end pr-4 items-center flex bg-slate-950 rounded-xl border-black border-2 border-solid">
                <h2 className="sm:pl-4 pl-2">Member since:</h2>
              </div>
              <div className=" sm:h-14 h-10 items-center flex text-left sm:pl-4 pl-2 bg-slate-950 rounded-xl border-black border-2 border-solid">
                <h2 className="sm:pr-4 pr-2">{formattedDate}</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Render the carousels only if data is available */}
        <div id="favourite-stories">
          <h1 className="text-3xl font-playfair text-creamyText mb-2 mt-8">
            Your favourites...
          </h1>
          {/* Ensure that the data is passed down to CenterMode only after fetching */}
          <CenterMode favouriteStories={favouritedStories} type={"fave"} />
        </div>

        <div id="submitted-stories">
          <h1 className="text-3xl font-playfair text-creamyText mb-2">
            Your submitted stories...
          </h1>
          <CenterMode favouriteStories={submittedStories} type={"sub"} />
        </div>
      </section>
    </main>
  );
};

export default Profile;
