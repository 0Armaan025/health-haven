"use client";
import React, { useState } from "react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import UserLeftSideBar from "@/components/user-left-side-bar/UserLeftSideBar";

const UserDashboardPage: React.FC = () => {
  const [username, setUsername] = useState<string>("John Doe");
  const [editedUsername, setEditedUsername] = useState<string>(username);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedUsername(e.target.value);
  };

  const handleSaveUsername = () => {
    setUsername(editedUsername);
  };

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen bg-gray-800 text-gray-100">
        {/* Left Sidebar */}
        <UserLeftSideBar />

        {/* Main Dashboard Content */}
        <div className="flex-1 p-8 space-y-6">
          <h1 className="text-3xl font-semibold text-red-500">
            Welcome, {username}
          </h1>

          {/* Profile Section */}
          <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-gray-100">
              Profile
            </h2>
            <div className="flex items-center space-x-4">
              <input
                type="text"
                value={editedUsername}
                onChange={handleUsernameChange}
                className="p-3 rounded-md w-48 bg-gray-800 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button
                onClick={handleSaveUsername}
                className="px-6 py-2 bg-red-500 text-gray-100 rounded-md hover:bg-red-600"
              >
                Save
              </button>
            </div>
          </div>

          {/* Logs Section */}

          {/* Logout Button */}
          <div className="flex justify-center">
            <button className="px-6 py-2 bg-red-500 text-gray-100 rounded-md hover:bg-red-600">
              Log Out
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserDashboardPage;
