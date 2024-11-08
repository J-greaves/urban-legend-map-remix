import React, { useCallback } from "react";
import { useStytch } from "@stytch/react";

export const LogOutButton = () => {
  const stytch = useStytch();

  const logout = useCallback(() => {
    stytch.session.revoke();
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
