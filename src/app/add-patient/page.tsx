"use client";
import React, { useState } from "react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

const AddPatientsPage: React.FC = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [roomName, setRoomName] = useState("");
  const [remarks, setRemarks] = useState("");
  const [rooms] = useState(["Room 101", "Room 102", "Room 103", "Room 104"]);

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to handle form submission
    console.log({ fullName, email, roomName, remarks });
    alert("Patient added successfully!");
    // Reset the form
    setFullName("");
    setEmail("");
    setRoomName("");
    setRemarks("");
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 px-4 py-8">
        <h3 className="text-3xl font-semibold mb-8 text-red-500 font-poppins">
          Add New Patient
        </h3>
        <form
          className="w-full max-w-lg bg-gray-700 p-6 rounded-lg shadow-lg space-y-6"
          onSubmit={handleAddPatient}
        >
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full p-3 rounded-md bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 rounded-md bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label
              htmlFor="roomName"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Room Name
            </label>
            <select
              id="roomName"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              required
              className="w-full p-3 rounded-md bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="" disabled>
                Select a room
              </option>
              {rooms.map((room) => (
                <option key={room} value={room}>
                  {room}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="remarks"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Remarks
            </label>
            <textarea
              id="remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={4}
              className="w-full p-3 rounded-md bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-gray-100 font-semibold rounded-md transition-all"
          >
            Add Patient
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default AddPatientsPage;
