import { useEffect } from "react";
import { useStytch } from "@stytch/react";
import { useNavigate } from "@remix-run/react";

const Authenticate = () => {
  const stytch = useStytch();
  const navigate = useNavigate();

  useEffect(() => {
    const authenticate = async () => {
      const token = new URLSearchParams(window.location.search).get("token");
      if (token) {
        try {
          const response = await stytch.oauth.authenticate(token, {
            session_duration_minutes: 60,
          });

          if (response) {
            console.log("Authentication successful:", response);

            const email = response.user.emails[0].email;

            if (email) {
              const userExists = await checkIfUserExists(email);
              console.log(userExists, "userExists just before nav");
              if (userExists) {
                navigate("/profile");
              } else {
                navigate("/signup");
              }
            } else {
              console.error("Email not found in the authentication response.");
              navigate("/error");
            }
          }
        } catch (error) {
          console.error("Error authenticating token", error);
          navigate("/error");
        }
      }
    };

    authenticate();
  }, [stytch, navigate]);

  const checkIfUserExists = async (email: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/users/check-user?email=${email}`
      );
      const data = await response.json();
      console.log(data, "data from auth return");
      // Check if the backend says the user exists
      return data.exists;
    } catch (error) {
      console.error("Error checking user existence", error);
      return false;
    }
  };

  return <div>Loading...</div>;
};

export default Authenticate;
