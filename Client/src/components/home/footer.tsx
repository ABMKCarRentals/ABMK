import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaEnvelope,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-black gold pt-28 px-6 mont">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 pb-8">
        {/* Logo and Description */}
        <div>
          <h2 className="text-2xl mb-2 racing">ABMK Car Rentals</h2>
          <p className="text-sm text-gray-600 mb-4">
            Premium car rental service with a wide selection of luxury and
            everyday vehicles for all your driving needs.
          </p>
          <div className="flex space-x-4">
            <a
              href="https://www.facebook.com/share/1623Y3nRdA/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FaFacebookF className="hover:text-yellow-500 cursor-pointer" />
            </a>
            <a
              href="https://www.instagram.com/abmk_carrentals?igsh=MXVuNHV0Zm94czE1dg=="
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram className="hover:text-yellow-500 cursor-pointer" />
            </a>
            <a
              href="https://twitter.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <FaTwitter className="hover:text-yellow-500 cursor-pointer" />
            </a>
            <a href="mailto:info@abmkcarrental.com" aria-label="Email">
              <FaEnvelope className="hover:text-yellow-500 cursor-pointer" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li
              className="hover:text-yellow-500 cursor-pointer"
              onClick={() => navigate("/")}
            >
              Home
            </li>
            <li
              className="hover:text-yellow-500 cursor-pointer"
              onClick={() => navigate("/cars")}
            >
              All Cars
            </li>
            <li
              className="hover:text-yellow-500 cursor-pointer"
              onClick={() => navigate("/categories")}
            >
              Categories
            </li>
            <li
              className="hover:text-yellow-500 cursor-pointer"
              onClick={() => navigate("/about")}
            >
              About Us
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Resources</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li
              className="hover:text-yellow-500 cursor-pointer"
              onClick={() => navigate("/contact")}
            >
              Contact
            </li>
            <li
              className="hover:text-yellow-500 cursor-pointer"
              onClick={() => navigate("/disclaimer")}
            >
              Terms of Service
            </li>
            <li
              className="hover:text-yellow-500 cursor-pointer"
              onClick={() => navigate("/privacy")}
            >
              Privacy Policy
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="gold">
          <h3 className="text-lg font-semibold mb-3">Contact</h3>
          <ul className="space-y-2 text-sm cursor-pointer ">
            <a
              href="https://www.google.com/maps/place/Business+Bay+-+Dubai+-+United+Arab+Emirates/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              Business Bay, Dubai, UAE
            </a>

            <li className="hover:text-white mt-2">
              <a href="tel:+971552082602">+971 552082602</a>
            </li>
            <li className="hover:text-white">
              <a href="mailto:info@abmkcarrental.com">info@abmkcarrental.com</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="text-center text-xs text-gold py-4 flex flex-col md:flex-row justify-between items-center max-w-full mx-auto">
        <p>© 2025 ABMK Car Rentals. All rights reserved.</p>
        <div className="space-x-4 mt-2 md:mt-0">
          <span
            className="hover:text-yellow-300 cursor-pointer"
            onClick={() => navigate("/privacy")}
          >
            Privacy
          </span>
          <span className="text-yellow-600">|</span>
          <span
            className="hover:text-yellow-300 cursor-pointer"
            onClick={() => navigate("/terms")}
          >
            Terms
          </span>
          <span className="text-yellow-600">|</span>
          <span
            className="hover:text-yellow-300 cursor-pointer"
            onClick={() => navigate("/cookies")}
          >
            Cookies
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
