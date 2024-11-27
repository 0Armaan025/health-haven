"use client";
import React, { useState } from "react";
import LeftSideBar from "./LeftSideBar"; // Placeholder for the LeftSideBar component
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";
import Link from "next/link";
import { redirect } from "next/navigation";

type Room = {
  id: string;
  name: string;
  status: string; // e.g., "Available", "Occupied", etc.
};

const DashboardPage: React.FC = ({}) => {
  const [hospitalCode, setHospitalCode] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const rooms = [
    { id: "1", name: "Room 101", status: "Available" },
    { id: "2", name: "Room 102", status: "Occupied" },
    { id: "3", name: "Room 103", status: "Available" },
    { id: "4", name: "Room 104", status: "Occupied" },
    { id: "5", name: "Room 105", status: "Available" },
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(hospitalCode);
    alert("Hospital code copied to clipboard!");
  };

  return (
    <>
      <div className="min-h-screen flex bg-gradient-to-r from-gray-800 via-gray-900 to-black text-gray-100">
        <LeftSideBar />

        {/* Main Content */}
        <div className="flex-grow p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">ARMAAN'S HOSPITAL</h1>
            <div className="inline-flex items-center bg-gray-700 px-4 py-2 rounded-lg shadow-lg">
              <span className="text-xl font-medium">3412312</span>
              <button
                onClick={copyToClipboard}
                className="ml-4 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
              >
                Copy
              </button>
            </div>

            <h4
              className="mt-2 underline text-[#39af7a] cursor-pointer"
              onClick={() => {
                redirect("/room-management");
              }}
            >
              Add a room
            </h4>
          </div>

          {/* Room Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="p-6 bg-gray-700 cursor-pointer rounded-lg shadow-lg transform hover:scale-105 transition"
              >
                <h2 className="text-2xl font-bold mb-2">{room.name}</h2>
                <p
                  className={`text-lg ${
                    room.status === "Available"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {room.status}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DashboardPage;
