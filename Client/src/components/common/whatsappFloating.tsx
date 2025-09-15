import { ArrowUp, Phone } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { useLocation } from "react-router-dom";

const phoneNumber = "9710551202434"; // Update this if needed

const WhatsappFloatButton: React.FC = () => {
  const [showScroll, setShowScroll] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Hide if current route contains /admin
  if (location.pathname.includes("/admin")) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex md:flex-row flex-col gap-3 items-end">
      {/* WhatsApp Button */}
      <a
        href={`https://wa.me/${phoneNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
      >
        <div className="bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg p-4 flex items-center justify-center transition-all duration-200">
          <FaWhatsapp className="w-8 h-8" />
        </div>
      </a>

      {/* Phone Call Button */}
      <a href={`tel:${phoneNumber}`}>
        <div className="bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg p-4 flex items-center justify-center transition-all duration-200">
          <Phone className="w-8 h-8" />
        </div>
      </a>

      {/* Scroll to Top Button */}
      {showScroll && (
        <button
          onClick={scrollToTop}
          className="bg-black hover:bg-gray-800 text-white rounded-full shadow-lg p-4 flex items-center justify-center transition-all duration-200"
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
};

export default WhatsappFloatButton;
