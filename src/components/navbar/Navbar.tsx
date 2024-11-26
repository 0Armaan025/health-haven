import React from "react";
import Image from "next/image";
import "./navbar.css";
import LOGO from "../../../public/logo.png";
import Link from "next/link";

type Props = {};

const Navbar = () => {
  return (
    <div className="navbar flex items-center sticky z-50  top-0 justify-between px-4 py-3 shadow-md w-full  text-white">
      {/* Logo Section */}
      <div className="flex-shrink-0">
        <Link href="/">
          <Image
            src={LOGO}
            alt="logo"
            className="w-[10rem] cursor-pointer md:w-[10rem] h-auto" // Scales logo size based on screen width
          />
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="hidden md:flex justify-center items-center flex-1 gap-6">
        <Link href="/about">
          <h4
            className="text-lg font-medium cursor-pointer px-3 py-2 rounded-md hover:bg-gray-700 transition-all"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            About
          </h4>
        </Link>
        <a href="https://github.com/0Armaan025" target="_blank">
          <h4
            className="text-lg font-medium cursor-pointer px-3 py-2 rounded-md hover:bg-gray-700 transition-all"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Code
          </h4>
        </a>
      </div>

      {/* Button Section */}
      <div className="flex-shrink-0">
        <button
          className="text-lg font-semibold bg-red-600 px-4 py-2 rounded-full transition-all hover:bg-red-700"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          Dashboard
        </button>
      </div>
    </div>
  );
};

export default Navbar;
