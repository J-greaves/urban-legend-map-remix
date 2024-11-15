import { StytchLogin } from "@stytch/react";
import { Products } from "@stytch/vanilla-js";

const LoginOrSignup = () => {
  const styles = {
    fontFamily: "'Faculty Glyphic', sans-serif", // Overall font family

    container: {
      width: "90vw", // Set the container width to 90% of the viewport width
      backgroundColor: "#111827", // Light background color
      borderColor: "black", // Light border color
      borderRadius: "8px", // Rounded corners
      borderWidth: "2px", // Border thickness
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.4)", // Shadow effect
      maxWidth: "300px", // Maximum width of the container
      justifyContent: "center",
    },

    colors: {
      primary: "#FAEBD7", // Main brand color, applied to most text
      secondary: "#333", // Secondary color for less emphasized text
      success: "#28a745", // Color for success messages or icons
      error: "#dc3545", // Color for error messages
    },
  };

  const config = {
    products: ["oauth"],
    oauthOptions: {
      providers: [
        {
          type: "google",
          one_tap: false,
          position: "floating",
        },
      ],
    },
  };

  return (
    <div className="flex flex-col bg-gray-900 w-full h-[100vh]  sm:justify-center items-center gap-10">
      <img
        className="sm:mt-0 mt-8 max-h-[80px] overflow-hidden"
        src="/logo.png"
      />
      <StytchLogin config={config} styles={styles} />
    </div>
  );
};

export default LoginOrSignup;
