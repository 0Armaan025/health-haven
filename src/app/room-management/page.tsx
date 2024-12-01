"use client";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";
import React, { useState, useEffect } from "react";
import { auth } from "../../firebase/firebaseConfig";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

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
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const db = getFirestore();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userEmail = user.email;
          const hospitalsRef = collection(db, "hospitals");
          const hospitalDocs = await getDocs(hospitalsRef);

          let isUserAuthorized = false;

          for (const hospitalDoc of hospitalDocs.docs) {
            const hospitalData = hospitalDoc.data();
            const members = hospitalData.members || [];

            if (members.includes(userEmail)) {
              isUserAuthorized = true;

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
              break;
            }
          }

          setIsAuthorized(isUserAuthorized);
          if (!isUserAuthorized)
            alert("Access denied: You are not a member of any hospital.");
        } catch (error) {
          console.error("Error fetching data:", error);
          setIsAuthorized(false);
        }
      } else {
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
        const hospitalsRef = collection(db, "hospitals");
        const hospitalDocs = await getDocs(hospitalsRef);

        let hospitalCode = null;

        for (const hospitalDoc of hospitalDocs.docs) {
          const hospitalData = hospitalDoc.data();
          const members = hospitalData.members || [];

          if (members.includes(user.email)) {
            hospitalCode = hospitalData.code;
            break;
          }
        }

        if (!hospitalCode) {
          return alert("You are not associated with any hospital.");
        }

        const hospitalDocRef = doc(db, "hospitals", hospitalCode);
        const roomsRef = collection(hospitalDocRef, "rooms");

        const newRoomDoc = await addDoc(roomsRef, {
          room_name: newRoom.name,
          type: newRoom.type,
          status: newRoom.status,
        });

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
      } catch (error) {
        console.error("Error adding room:", error);
        alert("Failed to add room. Please try again.");
      }
    } else {
      alert("You are not authorized to add rooms.");
    }
  };

  const handleEditRoom = async () => {
    if (!editingRoom) return;

    try {
      const db = getFirestore();
      const hospitalRef = collection(db, "hospitals");
      const hospitalDocs = await getDocs(hospitalRef);

      let hospitalCode = null;

      for (const hospitalDoc of hospitalDocs.docs) {
        const hospitalData = hospitalDoc.data();
        const members = hospitalData.members || [];

        if (members.includes(auth.currentUser?.email || "")) {
          hospitalCode = hospitalData.code;
          break;
        }
      }

      if (!hospitalCode) return alert("Hospital not found.");

      const hospitalDocRef = doc(db, "hospitals", hospitalCode);
      const roomRef = doc(hospitalDocRef, "rooms", editingRoom.id);

      await updateDoc(roomRef, {
        room_name: editingRoom.name,
        type: editingRoom.type,
        status: editingRoom.status,
      });

      setRooms(
        rooms.map((room) =>
          room.id === editingRoom.id ? { ...editingRoom } : room
        )
      );
      setEditingRoom(null);
    } catch (error) {
      console.error("Error updating room:", error);
      alert("Failed to update room.");
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    try {
      const db = getFirestore();
      const hospitalRef = collection(db, "hospitals");
      const hospitalDocs = await getDocs(hospitalRef);

      let hospitalCode = null;

      for (const hospitalDoc of hospitalDocs.docs) {
        const hospitalData = hospitalDoc.data();
        const members = hospitalData.members || [];

        if (members.includes(auth.currentUser?.email || "")) {
          hospitalCode = hospitalData.code;
          break;
        }
      }

      if (!hospitalCode) return alert("Hospital not found.");

      const hospitalDocRef = doc(db, "hospitals", hospitalCode);
      const roomRef = doc(hospitalDocRef, "rooms", roomId);

      await deleteDoc(roomRef);

      setRooms(rooms.filter((room) => room.id !== roomId));
    } catch (error) {
      console.error("Error deleting room:", error);
      alert("Failed to delete room.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!isAuthorized) return <div>Access Denied</div>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-extrabold text-center mb-12 text-teal-400">
            Room Management
          </h1>

          {/* Add Room Form */}
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 mb-12">
            <h2 className="text-2xl font-bold text-teal-300 mb-4">
              Add New Room
            </h2>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <input
                type="text"
                placeholder="Room Name / Number"
                value={newRoom.name}
                onChange={(e) =>
                  setNewRoom({ ...newRoom, name: e.target.value })
                }
                className="flex-1 px-4 py-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              />
              <select
                value={newRoom.type}
                onChange={(e) =>
                  setNewRoom({ ...newRoom, type: e.target.value })
                }
                className="flex-1 md:flex-none px-4 py-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              >
                <option value="Stretcher">Stretcher</option>
                <option value="Wheelchair">Wheelchair</option>
                <option value="Emergency Room">Emergency Room</option>
              </select>
              <button
                onClick={handleAddRoom}
                className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition"
              >
                Add Room
              </button>
            </div>
          </div>

          {/* Room List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="bg-gray-800 rounded-lg shadow-lg p-6"
              >
                <h3 className="text-xl font-semibold mb-4 text-teal-300">
                  {room.name}
                </h3>
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between">
                    <p>Type: {room.type}</p>
                    <p>Status: {room.status}</p>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        setEditingRoom(room);
                      }}
                      className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteRoom(room.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Edit Room Form */}
          {editingRoom && (
            <div className="mt-12 bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-teal-300 mb-4">
                Edit Room
              </h2>
              <div className="flex flex-col md:flex-row items-center gap-4">
                <input
                  type="text"
                  value={editingRoom.name}
                  onChange={(e) =>
                    setEditingRoom({ ...editingRoom, name: e.target.value })
                  }
                  className="flex-1 px-4 py-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                />
                <select
                  value={editingRoom.type}
                  onChange={(e) =>
                    setEditingRoom({
                      ...editingRoom,
                      type: e.target.value as any,
                    })
                  }
                  className="flex-1 md:flex-none px-4 py-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                >
                  <option value="Stretcher">Stretcher</option>
                  <option value="Wheelchair">Wheelchair</option>
                  <option value="Emergency Room">Emergency Room</option>
                </select>
                <select
                  value={editingRoom.status}
                  onChange={(e) =>
                    setEditingRoom({
                      ...editingRoom,
                      status: e.target.value as any,
                    })
                  }
                  className="flex-1 md:flex-none px-4 py-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                >
                  <option value="Occupied">Occupied</option>
                  <option value="Available">Available</option>
                </select>
                <button
                  onClick={handleEditRoom}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RoomPage;
