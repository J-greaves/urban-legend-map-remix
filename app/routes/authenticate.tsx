import { useEffect } from "react";
import { useStytch } from "@stytch/react";
import { useNavigate } from "@remix-run/react";
import { useUser } from "../contexts/UserContext";
import Loading from "~/components/Loading";
import { checkIfUserExists } from "~/db/api";

const Authenticate = () => {
  const stytch = useStytch();
  const navigate = useNavigate();
  const { setLoggedInUser } = useUser();

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
              const userData = await checkIfUserExists(email);
              console.log(userData, "returned user data");
              if (userData.user) {
                setLoggedInUser({
                  id: userData.user.id,
                  username: userData.user.userName,
                  email: userData.user.email,
                  avatarUrl: userData.user.avatarUrl,
                  memberSince: userData.user.createdAt,
                });
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

  return <Loading />;
};

export default Authenticate;
