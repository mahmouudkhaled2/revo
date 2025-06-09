/* eslint-disable react/prop-types */
import { useState } from "react";
import { Link } from "react-router-dom";

const NavItem = ({ label, href, active = false }) => {
  return (
    <Link
      to={href}
      className={`text-white hover:opacity-80 transition-opacity  py-2 text-sm md:text-base relative ${
        active
          ? "after:absolute after:content-[''] after:w-full after:h-0.5 after:bg-white after:bottom-0 after:left-0"
          : ""
      }`}
    >
      {label}
    </Link>
  );
};

export const RestaurantNavbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  return (
    <header className="fixed top-[100px] left-0 right-0 z-20 bg-black bg-opacity-70">
      <nav className="container xl:max-w-[80%] mx-auto py-4 px-4 flex items-center justify-between gap-20">
        <div className="flex items-center gap-3">
          <img
            src="/assets/hagoga-logo.png"
            alt="Hagogah Logo"
            className="size-14 rounded-full object-cover"
          />
          <span className="text-white text-xl font-medium font-Inter">
            hagogah
          </span>
        </div>

        <div
          className={`absolute md:static top-[85px] start-0 end-0  w-full flex-1 items-center justify-between md:flex md:w-auto md:order-1 transition-all overflow-hidden ${
            showMenu ? "h-[300px]" : "h-[0px]"
          } md:h-auto `}
        >
          <div className="flex flex-col flex-1 items-center md:justify-between gap-5 xl:gap-10 bg-black bg-opacity-75 h-full md:bg-transparent p-4 md:p-0 font-bold rounded-b-lg md:space-x-6 rtl:space-x-reverse md:flex-row md:mt-0">
            <NavItem label="About Us" href="/for-restaurants/hagoga/about-us" active />
            <NavItem label="Menu" href="/for-restaurants/hagoga/menu" />
            <NavItem label="Reviews" href="/reviews" />
            <NavItem label="Contact" href="/contact" />
          </div>
        </div>

        <button
          id="menuToggler"
          className="text-white text-3xl cursor-pointer m-0 md:hidden "
          onClick={() => setShowMenu(!showMenu)}
        >
          <i className="fa-solid fa-bars "></i>
        </button>
      </nav>
    </header>
  );
};
