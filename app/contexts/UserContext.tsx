import { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of your context state
interface UserContextType {
  loggedInUser: {
    id: number;
    username: string;
    email: string;
    avatarUrl: string;
    memberSince: string;
  } | null;
  setLoggedInUser: (
    user: {
      id: number;
      username: string;
      email: string;
      avatarUrl: string;
      memberSince: string;
    } | null
  ) => void;
}

// Create the context with default values
const UserContext = createContext<UserContextType | undefined>(undefined);

// Custom hook to use the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

// UserProvider component to wrap your app and provide context
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [loggedInUser, setLoggedInUser] =
    useState<UserContextType["loggedInUser"]>(null);

  return (
    <UserContext.Provider value={{ loggedInUser, setLoggedInUser }}>
      {children}
    </UserContext.Provider>
  );
};
