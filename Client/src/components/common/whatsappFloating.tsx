import React from "react";
import { FaWhatsapp, FaPhoneAlt } from "react-icons/fa";

const phoneNumber = "971552082602"; // Update this if needed
const callNumber = "+971552082602"; // For tel: link

const WhatsappFloatButton: React.FC = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-row gap-3 justify-end items-end w-full">
      
      {/* WhatsApp Button */}
      <div className="flex flex-col md:flex-row gap-3">
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
        {/* Call Button */}
        <a href={`tel:${callNumber}`} aria-label="Call Now">
          <div className="bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg p-4 flex items-center justify-center transition-all duration-200">
            <FaPhoneAlt className="w-7 h-7" />
          </div>
        </a>
      </div>
    </div>
  );
};

export default WhatsappFloatButton;
