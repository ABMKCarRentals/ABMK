import {
  FaMapMarkerAlt,
  FaDirections,
  FaPhone,
  FaEnvelope,
  FaClock,
} from "react-icons/fa";

const FindUs = () => {
  const location =
    "Business Bay, Sheikh Zayed Rd - Dubai - United Arab Emirates";
  // Business Bay coordinates
  const lat = 25.1879;
  const lng = 55.2676;

  const handleDirectionsClick = () => {
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      location
    )}`;
    window.open(googleMapsUrl, "_blank");
  };

  const handleMapClick = () => {
    const googleMapsUrl = `https://www.google.com/maps/place/Business+Bay,+Dubai+-+United+Arab+Emirates/@${lat},${lng},15z`;
    window.open(googleMapsUrl, "_blank");
  };

  return (
    <div className="bg-black text-gold py-16 px-6 mont">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 racing gold">Find Us</h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Visit our premium location in the heart of Dubai's Business Bay
            district
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Google Maps with Custom Marker */}
          <div className="relative">
            <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-700 hover:border-yellow-500 transition-colors duration-300">
              <div className="relative h-125">
                {/* Google Maps Embed with marker */}
                <iframe
                  src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.293!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f42d1b5b2b2b1%3A0x1234567890abcdef!2sBusiness%20Bay%2C%20Dubai%20-%20United%20Arab%20Emirates!5e0!3m2!1sen!2sus!4v1642678901234!5m2!1sen!2sus&markers=color:red%7Clabel:A%7C${lat},${lng}`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-xl"
                ></iframe>

                {/* Custom Red Marker Overlay */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  <div className="relative">
                    {/* Pulsing Circle */}
                    <div className="absolute -top-3 -left-3 w-8 h-8 bg-red-500 rounded-full opacity-30 animate-ping"></div>
                    {/* Main Marker */}
                    <FaMapMarkerAlt className="text-4xl text-red-500 drop-shadow-2xl filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]" />
                  </div>
                </div>

                {/* Click overlay for opening in Google Maps */}
                <div
                  className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-80 rounded-lg p-3 cursor-pointer hover:bg-opacity-90 transition-all"
                  onClick={handleMapClick}
                >
                  <p className="text-sm text-white text-center flex items-center justify-center">
                    <FaDirections className="mr-2" />
                    Click to open in Google Maps
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Location Details */}
          <div className="space-y-6">
            {/* Address Card */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
              <div className="flex items-start space-x-4">
                <FaMapMarkerAlt className="text-2xl text-red-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-2 text- gold">
                    Our Address
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    Business Bay, Sheikh Zayed Rd
                    <br />
                    Dubai - United Arab Emirates
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4 text- gold">
                Contact Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <FaPhone className="text-yellow-500 flex-shrink-0" />
                  <div>
                    <span className="text-gray-400 text-sm block">Phone</span>
                    <a
                      href="tel:+971552082602"
                      className="text-gray-300 hover:text-yellow-300 transition-colors"
                    >
                      +971 552082602
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <FaEnvelope className="text-yellow-500 flex-shrink-0" />
                  <div>
                    <span className="text-gray-400 text-sm block">Email</span>
                    <a
                      href="mailto:info@abmkrentals.com"
                      className="text-gray-300 hover:text-yellow-300 transition-colors"
                    >
                      info@abmkrentals.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <FaClock className="text-yellow-500 flex-shrink-0" />
                  <div>
                    <span className="text-gray-400 text-sm block">Hours</span>
                    <span className="text-gray-300">
                      24/7 Service Available
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Get Directions Button */}
            <button
              onClick={handleDirectionsClick}
              className="w-full bg- goldbg hover:bg-yellow-500 text-black font-semibold py-4 px-6 rounded-xl transition-colors duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-yellow-500/20"
            >
              <FaDirections className="text-lg" />
              <span>Get Directions</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindUs;
