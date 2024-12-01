import React, { useEffect, useState } from "react";
import Image from "next/image";
import "./navbar.css";
import LOGO from "../../../public/logo.png";
import Link from "next/link";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../../firebase/firebaseConfig";

type Props = {};

const Navbar = () => {
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        const userData = userDoc.data();

        if (userData?.type) {
          setUserType(userData.type); // Set the user type based on Firestore document
        }
      }
    });

    // Cleanup on unmount
    return () => unsubscribe();
  }, []);

  const handleDashboardClick = () => {
    if (userType === "individual") {
      window.location.href = "/user-dashboard"; // Redirect to user dashboard
    } else {
      window.location.href = "/dashboard"; // Redirect to hospital dashboard
    }
  };

  return (
    <div className="navbar flex items-center sticky z-50 top-0 justify-between px-4 py-3 shadow-md w-full text-white">
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
        <a href="https://github.com/0Armaan025/health-haven" target="_blank">
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
          onClick={handleDashboardClick} // Call the function on click
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
