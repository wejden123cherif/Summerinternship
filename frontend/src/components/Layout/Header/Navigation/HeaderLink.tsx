"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { HeaderItem } from "../../../../types/menu";
import { usePathname } from "next/navigation";

const HeaderLink: React.FC<{ item: HeaderItem }> = ({ item }) => {
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const path = usePathname(); // current pathname (e.g. "/")
  const [hash, setHash] = useState(""); // current hash (e.g. "#courses")

  // Track window.location.hash and update on hash changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      setHash(window.location.hash);

      const onHashChange = () => setHash(window.location.hash);
      window.addEventListener("hashchange", onHashChange);

      return () => window.removeEventListener("hashchange", onHashChange);
    }
  }, []);

  // Helper to normalize paths (remove trailing slash)
  const normalizePath = (url: string) => url.replace(/\/$/, "");

  // Split item's href into path and hash parts
  const [itemPath, itemHash] = item.href.split("#");
  const normalizedItemPath = normalizePath(itemPath);

  // Determine active link:
  // Active if pathname matches AND
  //   (item has no hash and current hash is empty)
  //   OR (item hash matches current hash)
  const isActive =
    normalizePath(path) === normalizedItemPath &&
    (
      (!itemHash && !hash) ||
      (itemHash && `#${itemHash}` === hash)
    );

  const handleMouseEnter = () => {
    if (item.submenu) {
      setSubmenuOpen(true);
    }
  };

  const handleMouseLeave = () => {
    setSubmenuOpen(false);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={item.href}
        className={`text-xl flex hover:text-black font-bold capitalized relative ${
          isActive
            ? "text-black after:absolute after:w-8 after:h-1 after:bg-primary after:rounded-full after:-bottom-1"
            : "text-grey"
        }`}
      >
        {item.label}
        {item.submenu && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.5em"
            height="1.5em"
            viewBox="0 0 24 24"
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
        <div
          className="absolute py-2 left-0 mt-0.5 w-60 bg-white dark:bg-darklight dark:text-white shadow-lg rounded-lg"
          data-aos="fade-up"
          data-aos-duration="500"
        >
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
