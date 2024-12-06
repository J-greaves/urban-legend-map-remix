export interface CreateUserResponse {
  success: boolean;
  status: number;
  user?: {
    id: number;
    email: string;
    userName: string;
    avatarUrl?: string | null;
    createdAt: string;
  };
  error?: string;
}

export const checkIfUserExists = async (email: string) => {
  try {
    const response = await fetch(
      `http://localhost:3000/users/check-user?email=${email}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error checking user existence", error);
    return false;
  }
};

export const getUserStories = async (userId: number) => {
  try {
    const response = await fetch(
      `http://localhost:3000/users/${userId}/stories`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error getting users stories", error);
  }
};

export const createNewUser = async (
  email: string,
  userName: string,
  avatarUrl: string | null
): Promise<CreateUserResponse> => {
  try {
    const data = { email: email, userName: userName, avatarUrl: avatarUrl };
    const response = await fetch("http://localhost:3000/users/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error("Error response:", errorResponse); // Log server error response
      return {
        success: false,
        status: response.status,
        error: errorResponse?.message || "Unknown server error",
      };
    }

    const res = await response.json();
    console.log("Success response:", res); // Log success response
    return { success: true, status: 201, user: res.user };
  } catch (error) {
    console.error("Catch block error:", error);
    return { success: false, status: 500, error: (error as Error).message };
  }
};
