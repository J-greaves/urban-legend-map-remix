import { useCallback } from "react";
import { useStytch } from "@stytch/react";
import { useUser } from "~/contexts/UserContext";

export const LogOutButton = () => {
  const stytch = useStytch();
  const { setLoggedInUser } = useUser();

  const logout = useCallback(() => {
    stytch.session.revoke();
    setLoggedInUser(null);
  }, [stytch]);

  return (
    <button
      className="bg-white rounded text-black p-1 h-auto w-auto"
      onClick={logout}
    >
      Log out
    </button>
  );
};
