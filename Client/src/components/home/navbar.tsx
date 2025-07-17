import React, { useEffect, useState } from "react";

import { Menu, X, ChevronDown } from "lucide-react";
import logo from "../../assets/images/logonav.png";

import ferrari from "../../assets/images/brands/ferrari.png";
import lambo from "../../assets/images/brands/lambo.png";
import bentley from "../../assets/images/brands/bentley.png";
import rollsroyce from "../../assets/images/brands/rollsroyce.png";
import porsche from "../../assets/images/brands/porsche.png";
import benz from "../../assets/images/brands/benz.png";

const brands = [
  { name: "Ferrari", logo: ferrari },
  { name: "Lamborghini", logo: lambo },
  { name: "Bentley", logo: bentley },
  { name: "Rolls Royce", logo: rollsroyce },
  { name: "Porsche", logo: porsche },
  { name: "Mercedes", logo: benz },
];

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [brandsDropdownOpen, setBrandsDropdownOpen] = useState(false);

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

      // Close brands dropdown when clicking outside
      if (
        brandsDropdownOpen &&
        !target.closest(".brands-dropdown") &&
        !target.closest(".brands-trigger")
      ) {
        setBrandsDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [mobileMenuOpen, brandsDropdownOpen]);

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

  const handleBrandClick = (brandName: string) => {
    console.log(`Navigate to ${brandName} cars`);
    setBrandsDropdownOpen(false);
  };

  const handleViewAllBrands = () => {
    console.log("Navigate to all brands page");
    setBrandsDropdownOpen(false);
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
            <li key={item} className="relative">
              {item === "Brands" ? (
                <div className="relative">
                  <button
                    type="button"
                    className="brands-trigger flex items-center gap-1 hover:text-yellow-300 cursor-pointer transition-colors duration-200 py-2"
                    onMouseEnter={() => setBrandsDropdownOpen(true)}
                    onMouseLeave={() => {
                      // Delay closing to allow moving to dropdown
                      setTimeout(() => {
                        const dropdown = document.querySelector(
                          ".brands-dropdown:hover"
                        );
                        if (!dropdown) setBrandsDropdownOpen(false);
                      }, 100);
                    }}
                  >
                    {item}
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${
                        brandsDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Brands Dropdown - Matches Image */}
                  {brandsDropdownOpen && (
                    <div
                      className="brands-dropdown absolute top-full left-1/2 transform -translate-x-1/2 mt-4 bg-black rounded-2xl shadow-2xl z-50 p-6"
                      style={{ width: "800px" }}
                      onMouseEnter={() => setBrandsDropdownOpen(true)}
                      onMouseLeave={() => setBrandsDropdownOpen(false)}
                    >
                      {/* Brands Grid - 3 columns, 2 rows */}
                      <div className="grid grid-cols-3 gap-4">
                        {brands.map((brand) => (
                          <button
                            key={brand.name}
                            type="button"
                            onClick={() => handleBrandClick(brand.name)}
                            className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 hover:border- gold transition-all duration-300 group flex flex-col items-center justify-center h-32"
                          >
                            <img
                              src={brand.logo}
                              alt={brand.name}
                              className="w-12 h-12 object-contain mb-3 filter brightness-90 group-hover:brightness-110 transition-all duration-200"
                            />
                            <span className="text- gold group-hover:text-yellow-300 transition-colors duration-200 font-medium text-sm">
                              {brand.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <span className="hover:text-yellow-300 cursor-pointer transition-colors duration-200 py-2 block">
                  {item}
                </span>
              )}
            </li>
          ))}
        </ul>

        {/* Hamburger Button - Fixed */}
        <button
          type="button"
          className="md:hidden hamburger-button text- gold hover:text-yellow-300 transition-colors duration-200 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-black"
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
        className={`mobile-menu fixed top-0 right-0 h-full w-72 bg-black/95 backdrop-blur-md border-l border- gold z-50 transition-transform duration-300 ease-in-out md:hidden ${
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
              className="text- gold hover:text-yellow-300 transition-colors duration-200 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
              aria-label="Close mobile menu"
            >
              <X size={24} />
            </button>
          </div>

          {/* Menu Items */}
          <ul className="flex flex-col space-y-1 p-6 flex-1 overflow-y-auto">
            {navigationItems.map((item) => (
              <li key={item}>
                {item === "Brands" ? (
                  <div>
                    <button
                      type="button"
                      className="w-full text-left py-3 px-4 text- gold hover:text-yellow-300 hover:bg-yellow-400/10 rounded-lg transition-all duration-200 font-medium uppercase text-sm tracking-wide focus:outline-none focus:ring-2 focus:ring-yellow-400 flex items-center justify-between"
                      onClick={() => setBrandsDropdownOpen(!brandsDropdownOpen)}
                    >
                      {item}
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-200 ${
                          brandsDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Mobile Brands Submenu */}
                    {brandsDropdownOpen && (
                      <div className="ml-4 mt-2 space-y-1">
                        {brands.map((brand) => (
                          <button
                            key={brand.name}
                            type="button"
                            onClick={() => {
                              handleBrandClick(brand.name);
                              handleCloseMenu();
                            }}
                            className="w-full text-left py-2 px-3 flex items-center gap-3 text-gray-300 hover:text-yellow-300 hover:bg-yellow-400/10 rounded-lg transition-all duration-200 text-sm"
                          >
                            <img
                              src={brand.logo}
                              alt={brand.name}
                              className="w-6 h-6 object-contain"
                            />
                            {brand.name}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            handleViewAllBrands();
                            handleCloseMenu();
                          }}
                          className="w-full text-left py-2 px-3 mt-2 bg-yellow-600 hover:bg-yellow-500 text-black font-semibold rounded-lg transition-colors duration-200 text-sm"
                        >
                          View All Brands
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    className="w-full text-left py-3 px-4 text- gold hover:text-yellow-300 hover:bg-yellow-400/10 rounded-lg transition-all duration-200 font-medium uppercase text-sm tracking-wide focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    onClick={handleCloseMenu}
                  >
                    {item}
                  </button>
                )}
              </li>
            ))}
          </ul>

          {/* Footer */}
        </div>
      </div>
    </>
  );
};

export default Navbar;
