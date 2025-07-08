import { Fullscreen, CalendarDays, Search } from "lucide-react";
import video from "../../assets/videos/w1-launch-film-v2-9x16.mp4";

function Hero() {
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
        {/* Heading */}
        <h1 className="text- gold text-4xl md:text-6xl tracking-wide text-center mb-10 racing">
          With Every Mile, We Make You Smile
        </h1>

        {/* Search Bar */}
        <div className="bg-black/70 rounded-lg shadow-lg p-4 px-4 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 w-1/2 md:w-full max-w-4xl justify-between">
          {/* Pickup Location */}
          <div className="flex flex-col text-center">
            <span className="text-sm font-semibold text- gold">
              Pickup Location
            </span>
            <span className="text-gray-500 text-sm">
              Please select location
            </span>
          </div>

          {/* Pick-up Date */}
          <div className="flex flex-col">
            <span className="text-sm font-semibold text- gold">
              Pick-up Date
            </span>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              dd-mm-yyyy
              <CalendarDays size={16} />
            </div>
          </div>

          {/* Return Date */}
          <div className="flex flex-col">
            <span className="text-sm font-semibold text- gold">
              Return Date
            </span>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              dd-mm-yyyy
              <CalendarDays size={16} />
            </div>
          </div>

          {/* Search Button */}
          <button className="flex items-center justify-center bg-yellow-500 text-white font-medium text-sm px-6 py-2 rounded-lg hover:bg-yellow-600 transition">
            <Search size={16} className="mr-2" />
            Search
          </button>
        </div>
      </div>
    </div>
  );
}

export default Hero;
