"use client";

import { useState } from "react";
import Link from "next/link";
import { HeaderItem } from "../../../../types/menu";
import { usePathname } from "next/navigation";

const HeaderLink: React.FC<{ item: HeaderItem }> = ({ item }) => {
  const path = usePathname(); // Current route (e.g. "/")
  const [submenuOpen, setSubmenuOpen] = useState(false);

  // Normalize path to avoid trailing slash issues
  const normalizePath = (url: string) => url.replace(/\/$/, "");

  const [itemPath, itemHash] = item.href.split("#");
  const fullItemHash = itemHash ? `#${itemHash}` : "";
  const isActive =
    normalizePath(path) === normalizePath(itemPath) &&
    window.location.hash === fullItemHash;

  const handleClick = (e: React.MouseEvent) => {
    if (itemHash) {
      e.preventDefault();
      const element = document.getElementById(itemHash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", `#${itemHash}`);
      }
    }
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => item.submenu && setSubmenuOpen(true)}
      onMouseLeave={() => item.submenu && setSubmenuOpen(false)}
    >
      <Link
        href={item.href}
        onClick={handleClick}
        className={`text-xl flex font-bold transition-all duration-200 relative ${
          isActive
            ? "text-black after:absolute after:w-8 after:h-1 after:bg-primary after:rounded-full after:-bottom-1"
            : "text-gray-500 hover:text-black"
        }`}
      >
        {item.label}
        {item.submenu && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.5em"
            height="1.5em"
            viewBox="0 0 24 24"
            className="ml-1"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="m7 10l5 5l5-5"
            />
          </svg>
        )}
      </Link>

      {submenuOpen && (
        <div className="absolute py-2 left-0 mt-0.5 w-60 bg-white dark:bg-darklight dark:text-white shadow-lg rounded-lg z-10">
          {item.submenu?.map((subItem, index) => {
            const isSubItemActive = normalizePath(path) === normalizePath(subItem.href);
            return (
              <Link
                key={index}
                href={subItem.href}
                className={`block px-4 py-2 ${
                  isSubItemActive
                    ? "bg-primary text-white"
                    : "text-black dark:text-white hover:bg-primary"
                }`}
              >
                {subItem.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HeaderLink;