"use client";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";
import React, { useState } from "react";

type RoomType = "Stretcher" | "Wheelchair" | "Emergency Room";

type Room = {
  id: string;
  name: string;
  type: RoomType;
};

const RoomPage = () => {
  const [rooms, setRooms] = useState<Room[]>([
    { id: "1", name: "Room 101", type: "Stretcher" },
    { id: "2", name: "Room 102", type: "Emergency Room" },
  ]);

  const [newRoom, setNewRoom] = useState({ name: "", type: "Stretcher" });

  const handleAddRoom = () => {
    if (newRoom.name.trim() === "") return alert("Room name is required!");
    const updatedRooms = [
      ...rooms,
      {
        id: Date.now().toString(),
        name: newRoom.name,
        type: newRoom.type as RoomType,
      },
    ];
    setRooms(updatedRooms);
    setNewRoom({ name: "", type: "Stretcher" });
  };

  const handleEditRoom = (id: string, field: string, value: string) => {
    const updatedRooms = rooms.map((room) =>
      room.id === id ? { ...room, [field]: value } : room
    );
    setRooms(updatedRooms);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
        <h1
          className="text-4xl font-bold mb-8 text-center"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          Room Management
        </h1>

        {/* Add Room Form */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4">Add New Room</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Room Name / Number"
              value={newRoom.name}
              onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring focus:ring-red-500"
            />
            <select
              value={newRoom.type}
              onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value })}
              className="w-full sm:w-1/3 px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring focus:ring-red-500"
            >
              <option value="Stretcher">Stretcher</option>
              <option value="Wheelchair">Wheelchair</option>
              <option value="Emergency Room">Emergency Room</option>
            </select>
            <button
              onClick={handleAddRoom}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition"
            >
              Add Room
            </button>
          </div>
        </div>

        {/* Room List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-gray-800 p-6 rounded-lg shadow-lg relative"
            >
              <input
                type="text"
                value={room.name}
                onChange={(e) =>
                  handleEditRoom(room.id, "name", e.target.value)
                }
                className="w-full px-4 py-2 mb-2 bg-gray-700 rounded-lg focus:outline-none focus:ring focus:ring-red-500"
              />
              <select
                value={room.type}
                onChange={(e) =>
                  handleEditRoom(room.id, "type", e.target.value)
                }
                className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring focus:ring-red-500"
              >
                <option value="Stretcher">Stretcher</option>
                <option value="Wheelchair">Wheelchair</option>
                <option value="Emergency Room">Emergency Room</option>
              </select>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RoomPage;
