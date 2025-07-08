import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Menu, X } from "lucide-react";
import logo from "../../assets/images/logonav.png";

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        mobileMenuOpen &&
        !target.closest(".mobile-menu") &&
        !target.closest(".hamburger-button")
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [mobileMenuOpen]);

  // Lock scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const handleToggleMenu = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleCloseMenu = () => {
    setMobileMenuOpen(false);
  };

  const navigationItems = [
    "All Cars",
    "Brands",
    "Car Types",
    "About us",
    "Contact us",
  ];

  return (
    <>
      {/* Navbar */}
      <nav
        className={`${
          scrolled
            ? "bg-black/95 backdrop-blur border-b border- gold"
            : "bg-transparent"
        } text- gold px-6 py-4 fixed top-0 left-0 w-full z-40 flex items-center justify-between transition-all duration-300 mont`}
      >
        {/* Logo */}
        <div className="text-xl font-bold tracking-widest flex items-center gap-2">
          <img src={logo} alt="logo" width={50} height={25} />
          <span className="hidden sm:block">ABMK Rentals</span>
          <span className="sm:hidden">ABMK</span>
        </div>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center space-x-6 font-medium uppercase text-sm tracking-wide">
          {navigationItems.map((item) => (
            <li
              key={item}
              className="hover:text-yellow-300 cursor-pointer transition-colors duration-200"
            >
              {item}
            </li>
          ))}
          <Button className="ml-4 border gold text-md">
            Login
          </Button>
        </ul>

        {/* Hamburger Button - Fixed */}
        <button
          type="button"
          className="md:hidden hamburger-button text-yellow-400 hover:text-yellow-300 transition-colors duration-200 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-black"
          onClick={handleToggleMenu}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleToggleMenu(e);
            }
          }}
          aria-label="Toggle mobile menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
          onClick={handleCloseMenu}
        />
      )}

      {/* Mobile Slide Menu */}
      <div
        className={`mobile-menu fixed top-0 right-0 h-full w-72 bg-black/95 backdrop-blur-md border-l border-yellow-400 z-50 transition-transform duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-yellow-400/30">
            <div className="text-lg font-bold tracking-widest flex items-center gap-3">
              <img src={logo} alt="logo" width={40} height={20} />
              AMBK Rentals
            </div>
            <button
              type="button"
              onClick={handleCloseMenu}
              className="text-yellow-400 hover:text-yellow-300 transition-colors duration-200 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
              aria-label="Close mobile menu"
            >
              <X size={24} />
            </button>
          </div>

          {/* Menu Items */}
          <ul className="flex flex-col space-y-1 p-6 flex-1 overflow-y-auto">
            {navigationItems.map((item) => (
              <li key={item}>
                <button
                  type="button"
                  className="w-full text-left py-3 px-4 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10 rounded-lg transition-all duration-200 font-medium uppercase text-sm tracking-wide focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  onClick={handleCloseMenu}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>

          {/* Footer */}
          <div className="p-6 border-t border-yellow-400/30">
            <Button
              className="w-full flex justify-center border text-md py-3"
              onClick={handleCloseMenu}
            >
              Login
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
