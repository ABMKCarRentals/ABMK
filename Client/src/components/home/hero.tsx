import { FastForwardIcon } from "lucide-react";
import logo from "../../assets/images/logonavhero.png";
import video from "../../assets/videos/w1-launch-film-v2-9x16.mp4";

import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();
  return (
    <div className="w-full h-screen overflow-hidden relative">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover absolute inset-0 z-0"
      >
        <source src={video} type="video/mp4" />
      </video>

      {/* Overlay Blur */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md z-10"></div>

      {/* Centered Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-4">
        <img src={logo} />
        {/* Heading */}
        <h1 className="text- gold text-4xl md:text-6xl tracking-wide text-center mb-10 racing">
          With Every Mile, We Make You Smile
        </h1>

        <div className="flex justify-center items-center text- gold bg-black">
          <Button
            className="flex justify-center border items-center text-md gap-2 mont"
            onClick={() => {
              navigate("/cars");
            }}
          >
            Explore all Cars <FastForwardIcon />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Hero;
