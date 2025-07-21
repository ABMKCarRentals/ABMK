import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, Play, Pause } from "lucide-react";
import logo from "../../assets/images/logonav.png";
import anthem from "../../assets/videos/Anthem.mp3";

import ferrari from "../../assets/images/brands/ferrari.png";
import lambo from "../../assets/images/brands/lambo.png";
import bentley from "../../assets/images/brands/bentley.png";
import rollsroyce from "../../assets/images/brands/rollsroyce.png";
import porsche from "../../assets/images/brands/porsche.png";
import benz from "../../assets/images/brands/benz.png";

const brands = [
  { name: "Ferrari", logo: ferrari, slug: "ferrari" },
  { name: "Lamborghini", logo: lambo, slug: "lamborghini" },
  { name: "Bentley", logo: bentley, slug: "bentley" },
  { name: "Rolls Royce", logo: rollsroyce, slug: "rolls-royce" },
  { name: "Porsche", logo: porsche, slug: "porsche" },
  { name: "Mercedes", logo: benz, slug: "mercedes" },
];

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [brandsDropdownOpen, setBrandsDropdownOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Set initial volume when component mounts
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.1;
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-play audio on component mount
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const playAudio = async () => {
        try {
          await audio.play();
          setIsPlaying(true);
        } catch (error) {
          console.log("Autoplay was prevented:", error);
          setIsPlaying(false);
        }
      };

      const timer = setTimeout(playAudio, 100);
      return () => clearTimeout(timer);
    }
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

  const handleNavigation = (path: string) => {
    navigate(path);
    handleCloseMenu();
  };

  const handleBrandClick = (brandSlug: string) => {
    navigate(`/cars?brand=${brandSlug}`);
    setBrandsDropdownOpen(false);
    handleCloseMenu();
  };

  const handleViewAllBrands = () => {
    navigate("/brands");
    setBrandsDropdownOpen(false);
    handleCloseMenu();
  };

  const toggleAudio = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  // Handle audio ended event
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const handleEnded = () => setIsPlaying(false);
      const handleLoadedData = () => {
        audio.volume = 0.1;
        audio.play().catch((error) => {
          console.log("Autoplay was prevented:", error);
          setIsPlaying(false);
        });
      };

      audio.addEventListener("ended", handleEnded);
      audio.addEventListener("loadeddata", handleLoadedData);

      return () => {
        audio.removeEventListener("ended", handleEnded);
        audio.removeEventListener("loadeddata", handleLoadedData);
      };
    }
  }, []);

  // Check if current path is active
  const isActiveRoute = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navigationItems = [
    { label: "All Cars", path: "/cars" },
    { label: "Brands", path: "/brands", hasDropdown: true },
    { label: "Car Types", path: "/categories" },
    { label: "About us", path: "/about" },
    { label: "Contact us", path: "/contact" },
    { label: "Anthem", path: "", isAudio: true },
  ];

  return (
    <>
      {/* Hidden Audio Element */}
      <audio ref={audioRef} src={anthem} preload="auto" loop={false} />

      {/* Navbar */}
      <nav
        className={`${
          scrolled
            ? "bg-black/95 backdrop-blur border-b border-yellow-400"
            : "bg-transparent"
        } text-yellow-400 px-6 py-4 fixed top-0 left-0 w-full z-40 flex items-center justify-between transition-all duration-300 mont`}
      >
        {/* Logo */}
        <div
          className="text-xl font-bold tracking-widest flex items-center gap-2 cursor-pointer hover:text-yellow-300 transition-colors duration-200"
          onClick={() => handleNavigation("/")}
        >
          <img src={logo} alt="logo" width={50} height={25} />
          <span className="hidden sm:block">ABMK Car Rentals</span>
          <span className="sm:hidden">ABMK</span>
        </div>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center space-x-6 font-medium uppercase text-sm tracking-wide">
          {navigationItems.map((item) => (
            <li key={item.label} className="relative">
              {item.hasDropdown ? (
                <div className="relative">
                  <button
                    type="button"
                    className={`brands-trigger flex items-center gap-1 hover:text-yellow-300 cursor-pointer transition-colors duration-200 py-2 ${
                      isActiveRoute("/brands") || isActiveRoute("/cars")
                        ? "text-yellow-300"
                        : ""
                    }`}
                    onMouseEnter={() => setBrandsDropdownOpen(true)}
                    onMouseLeave={() => {
                      setTimeout(() => {
                        const dropdown = document.querySelector(
                          ".brands-dropdown:hover"
                        );
                        if (!dropdown) setBrandsDropdownOpen(false);
                      }, 100);
                    }}
                  >
                    {item.label}
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${
                        brandsDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Brands Dropdown */}
                  {brandsDropdownOpen && (
                    <div
                      className="brands-dropdown absolute top-full left-1/2 transform -translate-x-1/2 mt-4 bg-black rounded-2xl shadow-2xl z-50 p-6"
                      style={{ width: "800px" }}
                      onMouseEnter={() => setBrandsDropdownOpen(true)}
                      onMouseLeave={() => setBrandsDropdownOpen(false)}
                    >
                      <div className="grid grid-cols-3 gap-4">
                        {brands.map((brand) => (
                          <button
                            key={brand.name}
                            type="button"
                            onClick={() => handleBrandClick(brand.slug)}
                            className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 hover:border-yellow-400 transition-all duration-300 group flex flex-col items-center justify-center h-32"
                          >
                            <img
                              src={brand.logo}
                              alt={brand.name}
                              className="w-12 h-12 object-contain mb-3 filter brightness-90 group-hover:brightness-110 transition-all duration-200"
                            />
                            <span className="text-yellow-400 group-hover:text-yellow-300 transition-colors duration-200 font-medium text-sm">
                              {brand.name}
                            </span>
                          </button>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={handleViewAllBrands}
                        className="w-full mt-4 bg-yellow-600 hover:bg-yellow-500 text-black font-semibold rounded-lg py-3 transition-colors duration-200"
                      >
                        View All Brands
                      </button>
                    </div>
                  )}
                </div>
              ) : item.isAudio ? (
                <button
                  type="button"
                  onClick={toggleAudio}
                  className="flex items-center gap-2 hover:text-yellow-300 cursor-pointer transition-colors duration-200 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-black rounded-md px-2"
                  aria-label={isPlaying ? "Pause anthem" : "Play anthem"}
                >
                  <span>{item.label}</span>
                  {isPlaying ? (
                    <Pause size={16} className="text-yellow-300" />
                  ) : (
                    <Play size={16} className="text-yellow-400" />
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleNavigation(item.path)}
                  className={`hover:text-yellow-300 cursor-pointer transition-colors duration-200 py-2 block ${
                    isActiveRoute(item.path) ? "text-yellow-300" : ""
                  }`}
                >
                  {item.label}
                </button>
              )}
            </li>
          ))}
        </ul>

        {/* Hamburger Button */}
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
            <div
              className="text-lg font-bold tracking-widest flex items-center gap-3 cursor-pointer"
              onClick={() => handleNavigation("/")}
            >
              <img src={logo} alt="logo" width={40} height={20} />
              ABMK Rentals
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
              <li key={item.label}>
                {item.hasDropdown ? (
                  <div>
                    <button
                      type="button"
                      className={`w-full text-left py-3 px-4 hover:text-yellow-300 hover:bg-yellow-400/10 rounded-lg transition-all duration-200 font-medium uppercase text-sm tracking-wide focus:outline-none focus:ring-2 focus:ring-yellow-400 flex items-center justify-between ${
                        isActiveRoute("/brands") || isActiveRoute("/cars")
                          ? "text-yellow-300 bg-yellow-400/10"
                          : "text-yellow-400"
                      }`}
                      onClick={() => setBrandsDropdownOpen(!brandsDropdownOpen)}
                    >
                      {item.label}
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
                            onClick={() => handleBrandClick(brand.slug)}
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
                          onClick={handleViewAllBrands}
                          className="w-full text-left py-2 px-3 mt-2 bg-yellow-600 hover:bg-yellow-500 text-black font-semibold rounded-lg transition-colors duration-200 text-sm"
                        >
                          View All Brands
                        </button>
                      </div>
                    )}
                  </div>
                ) : item.isAudio ? (
                  <button
                    type="button"
                    onClick={toggleAudio}
                    className="w-full text-left py-3 px-4 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10 rounded-lg transition-all duration-200 font-medium uppercase text-sm tracking-wide focus:outline-none focus:ring-2 focus:ring-yellow-400 flex items-center justify-between"
                    aria-label={isPlaying ? "Pause anthem" : "Play anthem"}
                  >
                    <span>{item.label}</span>
                    {isPlaying ? (
                      <Pause size={16} className="text-yellow-300" />
                    ) : (
                      <Play size={16} className="text-yellow-400" />
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    className={`w-full text-left py-3 px-4 hover:text-yellow-300 hover:bg-yellow-400/10 rounded-lg transition-all duration-200 font-medium uppercase text-sm tracking-wide focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                      isActiveRoute(item.path)
                        ? "text-yellow-300 bg-yellow-400/10"
                        : "text-yellow-400"
                    }`}
                    onClick={() => handleNavigation(item.path)}
                  >
                    {item.label}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;
