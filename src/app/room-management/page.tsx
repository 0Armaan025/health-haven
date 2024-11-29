"use client";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";
import React, { useState, useEffect } from "react";
import { auth } from "../../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  getDocs,
  addDoc,
} from "firebase/firestore";

type RoomType = "Stretcher" | "Wheelchair" | "Emergency Room";

type Status = "Occupied" | "Available";

type Room = {
  id: string;
  name: string;
  type: RoomType;
  status: Status;
};

const RoomPage = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [newRoom, setNewRoom] = useState({
    name: "",
    type: "Stretcher",
    status: "Available",
  });
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const db = getFirestore();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userEmail = user.email; // Get logged-in user's email

          // Get all hospitals collection
          const hospitalsRef = collection(db, "hospitals");
          const hospitalDocs = await getDocs(hospitalsRef);

          let isUserAuthorized = false;

          // Iterate over all hospitals and check if the user's email exists in the members array
          for (const hospitalDoc of hospitalDocs.docs) {
            const hospitalData = hospitalDoc.data();
            const members = hospitalData.members || [];

            if (members.includes(userEmail)) {
              isUserAuthorized = true;

              // Fetch rooms subcollection if user is a member
              const roomsRef = collection(hospitalDoc.ref, "rooms");
              const roomDocs = await getDocs(roomsRef);

              if (!roomDocs.empty) {
                const fetchedRooms = roomDocs.docs.map((roomDoc) => ({
                  id: roomDoc.id,
                  name: roomDoc.data().room_name,
                  type: roomDoc.data().type as RoomType,
                  status: roomDoc.data().status as Status,
                }));
                setRooms(fetchedRooms);
              } else {
                setRooms([]);
              }
              break; // Exit loop once a matching hospital is found
            }
          }

          if (!isUserAuthorized) {
            alert("Access denied: You are not a member of any hospital.");
            setIsAuthorized(false);
          } else {
            setIsAuthorized(true);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          setIsAuthorized(false);
        }
      } else {
        console.error("No authenticated user found!");
        setIsAuthorized(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddRoom = async () => {
    if (newRoom.name.trim() === "") return alert("Room name is required!");

    const db = getFirestore();
    const user = auth.currentUser;

    if (user && isAuthorized) {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const hospitalCode = userDoc.data()?.hospitalCode;

        if (hospitalCode) {
          const hospitalDocRef = doc(db, "hospitals", hospitalCode);
          const roomsRef = collection(hospitalDocRef, "rooms");

          // Add new room to Firestore
          const newRoomDoc = await addDoc(roomsRef, {
            room_name: newRoom.name,
            type: newRoom.type,
            status: newRoom.status,
          });

          // Update local state
          setRooms([
            ...rooms,
            {
              id: newRoomDoc.id,
              name: newRoom.name,
              type: newRoom.type as RoomType,
              status: newRoom.status as Status,
            },
          ]);

          setNewRoom({ name: "", type: "Stretcher", status: "Available" });
        }
      } catch (error) {
        console.error("Error adding room:", error);
      }
    } else {
      alert("You are not authorized to add rooms.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-100">
        <h1>Loading...</h1>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-100">
        <h1 className="text-3xl font-bold">Access Denied</h1>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Room Management</h1>

        {/* Add Room Form */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4">Add New Room</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Room Name / Number"
              value={newRoom.name}
              onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none"
            />
            <select
              value={newRoom.type}
              onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value })}
              className="w-full sm:w-1/3 px-4 py-2 bg-gray-700 rounded-lg focus:outline-none"
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
          {rooms.length > 0 ? (
            rooms.map((room) => (
              <div
                key={room.id}
                className="bg-gray-800 p-6 rounded-lg shadow-lg"
              >
                <h2 className="text-2xl font-bold">{room.name}</h2>
                <p>Type: {room.type}</p>
                <p
                  className={`mt-2 ${
                    room.status === "Available"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {room.status}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400">No rooms available.</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RoomPage;
