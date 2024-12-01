"use client";
import React from "react";
import { FaHome, FaBell, FaUser, FaSignOutAlt, FaBook } from "react-icons/fa"; // Icons for better UI
import { getAuth, signOut } from "firebase/auth";
import { doc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../../firebase/firebaseConfig"; // Import your firebase config

type Props = {};

const UserLeftSideBar: React.FC<Props> = () => {
  const menuItems = [
    { name: "Profile", icon: <FaUser />, path: "/user-dashboard" },
    { name: "User Logs", icon: <FaBook />, path: "/view-logs" },
    { name: "Log out", icon: <FaSignOutAlt />, path: "/logout" },
  ];

  const handleLogout = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        // Delete the user's document from Firestore
        const userRef = doc(db, "users", user.uid);
        await deleteDoc(userRef);

        // Log out the user
        await signOut(auth);

        // Redirect to the login page after logging out
        window.location.href = "/login"; // Adjust the path as per your login page route
      } catch (error) {
        console.error("Error during logout:", error);
      }
    }
  };

  return (
    <div className="w-64 h-screen bg-gray-900 text-gray-100 flex flex-col shadow-lg">
      {/* Sidebar Header */}
      <div className="text-center py-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-red-600">User Dashboard</h1>
        <p className="text-sm text-gray-400">Manage your account</p>
      </div>

      {/* Menu Items */}
      <nav className="flex-grow">
        <ul className="mt-6 space-y-2 px-4">
          {menuItems.map((item) => (
            <li key={item.name}>
              {item.name === "Log out" ? (
                <button
                  onClick={handleLogout} // Call logout function on click
                  className="flex items-center w-full px-4 py-3 text-left text-gray-200 rounded-lg hover:bg-gray-800 hover:text-red-500 transition"
                >
                  <span className="text-xl mr-3">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </button>
              ) : (
                <button
                  onClick={() => (window.location.href = item.path)}
                  className="flex items-center w-full px-4 py-3 text-left text-gray-200 rounded-lg hover:bg-gray-800 hover:text-red-500 transition"
                >
                  <span className="text-xl mr-3">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </button>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="py-4 border-t border-gray-800 text-center text-sm text-gray-400">
        <p>&copy; 2024 User Dashboard</p>
      </div>
    </div>
  );
};

export default UserLeftSideBar;
