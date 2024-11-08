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

  return (
    <div className="flex flex-col bg-gray-900 h-[100vh] sm:justify-center items-center gap-10">
      <img
        className="sm:mt-0 mt-8 max-h-[80px] overflow-hidden"
        src="/logo.png"
      />
      <StytchLogin config={config} />
    </div>
  );
};

export default LoginOrSignup;
