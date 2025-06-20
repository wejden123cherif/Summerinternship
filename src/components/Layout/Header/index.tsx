"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { headerData } from "../Header/Navigation/menuData"; // Ensure this path is correct
import Logo from "./Logo"; // Ensure this path is correct
import Image from "next/image";
import HeaderLink from "../Header/Navigation/HeaderLink"; // Ensure this path is correct
import MobileHeaderLink from "../Header/Navigation/MobileHeaderLink"; // Ensure this path is correct
import { useTheme } from "next-themes";
import { Icon } from "@iconify/react/dist/iconify.js";

const Header: React.FC = () => {
  const pathUrl = usePathname();
  const { theme, setTheme } = useTheme();

  const [navbarOpen, setNavbarOpen] = useState(false);
  const [sticky, setSticky] = useState(false);

  const navbarRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Effect for sticky header
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // Run once on mount

  // Effect to close mobile menu on outside click or escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setNavbarOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setNavbarOpen(false);
      }
    };

    if (navbarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [navbarOpen]);


  const handleScroll = () => {
    setSticky(window.scrollY >= 80);
  };

  return (
    <header
      dir="rtl" // Set overall direction to RTL
      className={`fixed top-0 z-40 w-full pb-5 transition-all duration-300 bg-white ${
        sticky ? "shadow-lg py-5" : "shadow-none py-6"
      }`}
    >
      <div className="lg:py-0 py-2">
        <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md flex items-center justify-between px-4">
          {/* Logo - This will appear on the right in RTL due to flex justify-between */}
          <Logo />

          {/* Desktop Navigation - Ordered after Logo for RTL flow */}
          <nav className="hidden lg:flex flex-grow items-center gap-8 justify-center">
            {headerData.map((item, index) => (
              <HeaderLink key={index} item={item} />
            ))}
          </nav>

          {/* Auth Buttons / Theme Switcher / Mobile Menu Toggle */}
          <div className="flex items-center gap-4">
            {/* You had empty lines here. Add your Sign In/Sign Up buttons or theme switcher here.
                Example (assuming translations and styles from previous discussions):
            */}
            <button className="px-6 py-3 rounded-full bg-blue-600 text-white text-lg font-semibold hover:bg-blue-700 transition">
              تسجيل الدخول
            </button>
            <button className="px-6 py-3 rounded-full bg-purple-200 text-purple-800 text-lg font-semibold hover:bg-purple-300 transition">
              التسجيل
            </button>
            {/* End of example buttons */}

            {/* Mobile Menu Toggle Button */}
            {/* Order for RTL: Toggle button should be after auth buttons if they are on left */}
            <button
              onClick={() => setNavbarOpen(!navbarOpen)}
              className="block lg:hidden p-2 rounded-lg"
              aria-label="Toggle mobile menu"
            >
              <span className="block w-6 h-0.5 bg-white"></span>
              <span className="block w-6 h-0.5 bg-white mt-1.5"></span>
              <span className="block w-6 h-0.5 bg-white mt-1.5"></span>
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {navbarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" /> // Use inset-0 for full screen overlay
        )}

        {/* Mobile Menu Sidebar */}
        <div
          ref={mobileMenuRef}
          className={`lg:hidden fixed top-0 left-0 h-full w-full bg-darkmode shadow-lg transform transition-transform duration-300 max-w-xs ${
            navbarOpen ? "translate-x-0" : "translate-x-full"
          } z-50`} // Changed right-0 to left-0 for RTL slide-in from right
        >
          <div className="flex items-center justify-between p-4">
            {/* Corrected: Logo component should be used directly, not inside an h2 for semantic correctness here */}
            <Logo />

            {/* Close Button for Mobile Menu */}
            <button
              onClick={() => setNavbarOpen(false)}
              // For RTL, if sliding from right, the close button should be on the left
              className="bg-[url('/images/closed.svg')] bg-no-repeat bg-contain w-5 h-5 absolute top-0 left-0 ml-8 mt-8 dark:invert" // Changed right-0 to left-0, mr-8 to ml-8
              aria-label="Close menu Modal"
            ></button>
          </div>
          <nav className="flex flex-col items-end p-4"> {/* items-end for RTL list alignment */}
            {headerData.map((item, index) => (
              <MobileHeaderLink key={index} item={item} />
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;