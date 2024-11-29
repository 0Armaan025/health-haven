"use client";
import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import LeftSideBar from "./LeftSideBar";
import Footer from "@/components/footer/Footer";
import { useRouter } from "next/navigation";

type Room = {
  id: string;
  room_name: string;
  status: string; // e.g., "Available", "Occupied", etc.
};

const DashboardPage: React.FC = ({}) => {
  const [hospitalCode, setHospitalCode] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const db = getFirestore();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userEmail = user.email;

        try {
          // Query hospitals collection to find a hospital where the user is a member
          const hospitalsRef = collection(db, "hospitals");
          const q = query(
            hospitalsRef,
            where("members", "array-contains", userEmail)
          );
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const hospitalDoc = querySnapshot.docs[0];
            const hospitalData = hospitalDoc.data();

            setHospitalCode(hospitalData.code || "Unknown Code");
            setHospitalName(hospitalData.name || "Unknown Name");

            // Check for the rooms subcollection
            const roomsRef = collection(
              db,
              "hospitals",
              hospitalDoc.id,
              "rooms"
            );
            const roomsSnapshot = await getDocs(roomsRef);

            if (!roomsSnapshot.empty) {
              const fetchedRooms: Room[] = roomsSnapshot.docs.map((doc) => ({
                id: doc.id,
                room_name: doc.data().room_name,
                status: doc.data().status,
              }));
              setRooms(fetchedRooms);
            } else {
              console.log("No rooms found in the subcollection.");
              setRooms([]);
            }

            setIsAuthorized(true);
          } else {
            console.error("User is not a member of any hospital.");
            setIsAuthorized(false);
          }
        } catch (error) {
          console.error("Error fetching hospital data:", error);
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
        <h1 className="text-3xl font-bold">YOU DO NOT HAVE ACCESS, SORRY</h1>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen flex bg-gradient-to-r from-gray-800 via-gray-900 to-black text-gray-100">
        <LeftSideBar />

        {/* Main Content */}
        <div className="flex-grow p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">{hospitalName}</h1>
            <div className="inline-flex items-center bg-gray-700 px-4 py-2 rounded-lg shadow-lg">
              <span className="text-xl font-medium">{hospitalCode}</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(hospitalCode);
                  alert("Hospital code copied to clipboard!");
                }}
                className="ml-4 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
              >
                Copy
              </button>
            </div>

            <h4
              className="mt-2 underline text-[#39af7a] cursor-pointer"
              onClick={() => {
                router.push("/room-management");
              }}
            >
              Add a room
            </h4>
          </div>

          {/* Room Grid */}
          {rooms.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className="p-6 bg-gray-700 cursor-pointer rounded-lg shadow-lg transform hover:scale-105 transition"
                >
                  <h2 className="text-2xl font-bold mb-2">{room.room_name}</h2>
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
          ) : (
            <div className="text-center text-gray-300 text-xl">
              No rooms available.
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DashboardPage;
