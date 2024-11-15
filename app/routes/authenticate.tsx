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
