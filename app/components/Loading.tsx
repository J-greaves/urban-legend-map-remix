import Lottie from "lottie-react";
import loading from "./loading.json";

const Loading = () => {
  const style = {
    height: 300,
    width: 300,
  };
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <Lottie animationData={loading} style={style} />
    </div>
  );
};

export default Loading;
