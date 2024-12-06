import { Link } from "@remix-run/react";
import type { User } from "@stytch/vanilla-js";
import { useCallback } from "react";
import { useStytch } from "@stytch/react";
import { useUser } from "~/contexts/UserContext";
import { useEffect } from "react";
import { checkIfUserExists } from "~/db/api";

interface BurgerMenuProps {
  user: User | null;
  burgerOnOff: boolean;
  setBurgerOnOff: React.Dispatch<React.SetStateAction<boolean>>;
}

const BurgerMenu: React.FC<BurgerMenuProps> = ({
  burgerOnOff,
  setBurgerOnOff,
  user,
}) => {
  const stytch = useStytch();
  const { loggedInUser, setLoggedInUser } = useUser();

  const logout = useCallback(() => {
    stytch.session.revoke();
    setLoggedInUser(null);
  }, [stytch]);

  useEffect(() => {
    const rehydrate = async () => {
      if (!loggedInUser && user) {
        const email = user.emails[0].email;
        const userData = await checkIfUserExists(email);
        setLoggedInUser({
          id: userData.user.id,
          username: userData.user.userName,
          email: userData.user.email,
          avatarUrl: userData.user.avatarUrl,
          memberSince: userData.user.createdAt,
        });
      }
    };
    rehydrate();
  }, []);

  return (
    <div
      className={`flex text-creamyText ]  text-4xl items-start flex-col gap-6 pl-2 pt-4 fixed top-0 left-0 w-[80%] max-w-[300px] h-full bg-gray-900 shadow-lg shadow-black border-r-2 border-slate-950 z-50 transform transition-transform duration-1000 ease-in-out ${
        burgerOnOff ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex flex-row w-full">
        {loggedInUser ? (
          <Link
            to="/profile"
            className="mt-4 place-self-center bg-gray-900 ml-3 rounded-full border hover:opacity-50 transition duration-300 ease-in-out w-[100px] h-[100px] overflow-hidden"
          >
            <img
              src={loggedInUser.avatarUrl}
              className="w-full h-full object-cover"
              alt="User Avatar"
            />
          </Link>
        ) : null}

        <button
          className="place-self-start bg-gray-900 p-1.5 ml-auto mr-3 rounded-xl border hover:bg-gray-700 transition duration-300 ease-in-out"
          onClick={() => {
            setBurgerOnOff(!burgerOnOff);
          }}
        >
          <img src="close.png" className="w-[32px]" />
        </button>
      </div>
      <div className="pl-6">
        {user ? (
          <div className="flex flex-col gap-6">
            <li className="transform hover:scale-105 transition-transform duration-200">
              <button>
                <Link to={"/profile"}>profile</Link>
              </button>
            </li>
            <li className="transform hover:scale-105 transition-transform duration-200">
              <button onClick={logout}>logout</button>
            </li>
          </div>
        ) : (
          <li className="transform hover:scale-105 transition-transform duration-200">
            <Link to="/login">login</Link>
          </li>
        )}
      </div>
      {user ? (
        <p className="mt-auto text-[18px] leading-tight mb-2">
          Logged in user:
          <br /> {user?.emails[0].email}
        </p>
      ) : null}
    </div>
  );
};

export default BurgerMenu;
