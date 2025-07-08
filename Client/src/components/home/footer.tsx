import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaEnvelope,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-black text-yellow-400 pt-28 px-6 mont">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 pb-8">
        {/* Logo and Description */}
        <div>
          <h2 className="text-2xl mb-2 racing">ABMK Rentals</h2>
          <p className="text-sm text-gray-600 mb-4">
            Premium car rental service with a wide selection of luxury and
            everyday vehicles for all your driving needs.
          </p>
          <div className="flex space-x-4">
            <FaFacebookF className="hover:text-yellow-500 cursor-pointer" />
            <FaInstagram className="hover:text-yellow-500 cursor-pointer" />
            <FaTwitter className="hover:text-yellow-500 cursor-pointer" />
            <FaEnvelope className="hover:text-yellow-500 cursor-pointer" />
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="hover:text-yellow-500 cursor-pointer">Home</li>
            <li className="hover:text-yellow-500 cursor-pointer">
              Browse Cars
            </li>
            <li className="hover:text-yellow-500 cursor-pointer">
              List Your Car
            </li>
            <li className="hover:text-yellow-500 cursor-pointer">About Us</li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Resources</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="hover:text-yellow-500 cursor-pointer">
              Help Center
            </li>
            <li className="hover:text-yellow-500 cursor-pointer">
              Terms of Service
            </li>
            <li className="hover:text-yellow-500 cursor-pointer">
              Privacy Policy
            </li>
            <li className="hover:text-yellow-500 cursor-pointer">Insurance</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>1234 Luxury Drive</li>
            <li>San Francisco, CA 94107</li>
            <li>
              <a href="tel:">+971 552082602</a>
            </li>
            <li>info@ambkrentals.com</li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="text-center text-xs text-yellow-500 py-4 flex flex-col md:flex-row justify-between items-center max-w-full mx-auto">
        <p>© 2025 ABMK Rentals. All rights reserved.</p>
        <div className="space-x-4 mt-2 md:mt-0">
          <span className="hover:text-yellow-300 cursor-pointer">Privacy</span>
          <span className="text-yellow-600">|</span>
          <span className="hover:text-yellow-300 cursor-pointer">Terms</span>
          <span className="text-yellow-600">|</span>
          <span className="hover:text-yellow-300 cursor-pointer">Cookies</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
