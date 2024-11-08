import { useEffect } from "react";
import { useStytch } from "@stytch/react";
import { useNavigate } from "@remix-run/react";

const Authenticate = () => {
  const stytch = useStytch(); // Access Stytch methods
  const navigate = useNavigate(); // For navigation after successful login

  useEffect(() => {
    const authenticate = async () => {
      const token = new URLSearchParams(window.location.search).get("token");
      if (token) {
        try {
          // Authenticate the token with Stytch
          const response = await stytch.magicLinks.authenticate(token, {
            session_duration_minutes: 60,
          });

          // If authentication is successful, navigate to the dashboard
          if (response) {
            console.log("Authentication successful:", response);
            navigate("/");
          }
        } catch (error) {
          console.error("Error authenticating token", error);
        }
      }
    };

    authenticate();
  }, [stytch, navigate]);

  return <div>Loading...</div>;
};

export default Authenticate;
