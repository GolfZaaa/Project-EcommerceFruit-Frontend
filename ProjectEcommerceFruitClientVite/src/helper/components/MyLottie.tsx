import React from "react";
import Lottie from "react-lottie";

interface props {
  lottieFile: any;
  height?: number;
  width?: number;
}

const MyLottie = ({ lottieFile, height = 400, width = 400 }: props) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: lottieFile,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return <Lottie options={defaultOptions} height={height} width={width} />;
};

export default MyLottie;
