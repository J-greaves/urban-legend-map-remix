import { StytchLogin } from "@stytch/react";
import { Products } from "@stytch/vanilla-js";

const LoginOrSignup = () => {
  const config = {
    products: [Products.emailMagicLinks],
    emailMagicLinksOptions: {
      loginRedirectURL: "http://localhost:5173/authenticate",
      signupRedirectURL: "http://localhost:5173/authenticate",
      loginExpirationMinutes: 60,
      signupExpirationMinutes: 60,
    },
  };

  return <StytchLogin config={config} />;
};

export default LoginOrSignup;
