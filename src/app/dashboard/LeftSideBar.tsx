"use client";
import React from "react";
import {
  FaHome,
  FaBell,
  FaUserInjured,
  FaRobot,
  FaSignOutAlt,
  FaHospital,
} from "react-icons/fa"; // Icons for better UI
import { FaPerson } from "react-icons/fa6";

type Props = {};

const LeftSideBar: React.FC<Props> = () => {
  const menuItems = [
    { name: "Dashboard", icon: <FaHome />, path: "/dashboard" },
    { name: "Room management", icon: <FaHospital />, path: "/room-management" },
    { name: "Notifications", icon: <FaBell />, path: "/notifications" },
    { name: "Patients", icon: <FaUserInjured />, path: "/patients" },
    { name: "Track (NEW AI FEATURE)", icon: <FaRobot />, path: "/track" },
    { name: "Hospital Staff", icon: <FaPerson />, path: "/staff" },
    { name: "Log out", icon: <FaSignOutAlt />, path: "/logout" },
  ];

  return (
    <div className="w-64 h-screen bg-gray-900 text-gray-100 flex flex-col shadow-lg sm:w-56 md:w-64 lg:w-72 xl:w-80">
      {/* Sidebar Header */}
      <div className="text-center py-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-red-600">Hospital Admin</h1>
        <p className="text-sm text-gray-400">Efficiently manage resources</p>
      </div>

      {/* Menu Items */}
      <nav className="flex-grow">
        <ul className="mt-6 space-y-2 px-4">
          {menuItems.map((item) => (
            <li key={item.name}>
              <button
                onClick={() => (window.location.href = item.path)}
                className="flex items-center w-full px-4 py-3 text-left text-gray-200 rounded-lg hover:bg-gray-800 hover:text-red-500 transition"
              >
                <span className="text-xl mr-3">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="py-4 border-t border-gray-800 text-center text-sm text-gray-400">
        <p>&copy; 2024 Hospital Admin</p>
      </div>
    </div>
  );
};

export default LeftSideBar;
