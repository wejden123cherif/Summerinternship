"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { headerData } from "../Header/Navigation/menuData"; // Ensure this path is correct
import Logo from "./Logo"; // Ensure this path is correct
import Image from "next/image";
import HeaderLink from "../Header/Navigation/HeaderLink";
import MobileHeaderLink from "../Header/Navigation/MobileHeaderLink";
import { useTheme } from "next-themes";
import { Icon } from "@iconify/react/dist/iconify.js";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from 'react-i18next';

const Header: React.FC = () => {
  const pathUrl = usePathname();
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();

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
    <header dir="rtl"
      className={`fixed top-0 z-40 w-full pb-5 transition-all duration-300 bg-white ${sticky ? " shadow-lg py-5" : "shadow-none py-6"
        }`}
    >
      <div className="lg:py-0 py-2">
        <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md flex items-center justify-between px-4">
          {/* Logo - This will appear on the right in RTL due to flex justify-between */}
          <Logo />
          <nav className="hidden lg:flex flex-grow items-center gap-8 justify-center">
            {/* Use HeaderLink components with translated labels */}
            <HeaderLink item={{ label: t('nav.home'), href: "/" }} />
            <HeaderLink item={{ label: t('nav.courses'), href: "/#courses" }} />
            <HeaderLink item={{ label: t('nav.partners'), href: "/#companies" }} />
            <HeaderLink item={{ label: t('nav.testimonials'), href: "/#testimonial" }} />
            <HeaderLink item={{ label: t('nav.support'), href: "/#newsletter" }} />
            <LanguageSwitcher />
          </nav>

          {/* Auth Buttons / Theme Switcher / Mobile Menu Toggle */}
          <div className="flex items-center gap-4">
            
           
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
            <MobileHeaderLink item={{ label: t('nav.home'), href: "/" }} />
            <MobileHeaderLink item={{ label: t('nav.courses'), href: "/#courses" }} />
            <MobileHeaderLink item={{ label: t('nav.partners'), href: "/#companies" }} />
            <MobileHeaderLink item={{ label: t('nav.testimonials'), href: "/#testimonial" }} />
            <MobileHeaderLink item={{ label: t('nav.support'), href: "/#newsletter" }} />
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;