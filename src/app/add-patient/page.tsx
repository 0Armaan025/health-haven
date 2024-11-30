"use client";
import React, { useState, useEffect } from "react";
import { auth, db } from "../../firebase/firebaseConfig";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

const AddPatientsPage: React.FC = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [roomName, setRoomName] = useState("");
  const [superRooms, setSuperRooms] = useState<string[]>([]);
  const [remarks, setRemarks] = useState("");
  const [rooms, setRooms] = useState<string[]>([]); // To store available rooms
  const [userType, setUserType] = useState<string | null>(null); // To store user type (hospital or other)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userEmail = user.email;
        setEmail(userEmail || "");

        const hospitalsRef = collection(db, "hospitals");

        // Query the "hospitals" collection to find the hospital where the user's email exists in the "members" field
        const hospitalsQuery = query(
          hospitalsRef,
          where("members", "array-contains", userEmail)
        );
        const querySnapshot = await getDocs(hospitalsQuery);

        if (!querySnapshot.empty) {
          // Find the document with matching email
          querySnapshot.forEach(async (docSnap) => {
            const hospitalData = docSnap.data();
            const hospitalCode = hospitalData?.code;

            if (hospitalCode) {
              // Now, use the hospital code to fetch the rooms subcollection
              const roomsRef = collection(
                db,
                "hospitals",
                hospitalCode,
                "rooms"
              );
              const roomsSnapshot = await getDocs(roomsRef);

              const availableRooms: string[] = [];
              roomsSnapshot.forEach((roomDoc) => {
                const roomData = roomDoc.data();
                console.log("Room data:", roomData); // Log room data to see what is fetched

                if (roomData?.room_name) {
                  availableRooms.push(roomData.room_name);
                  setSuperRooms([...superRooms, roomData.room_name]); // Fix: Use spread operator to add new room name to superRooms array
                }
              });

              console.log("Available rooms:", availableRooms); // Log available rooms after fetching
              setRooms(availableRooms); // Set the available rooms
              setUserType("hospital");
            }
          });
        } else {
          setUserType("other");
        }
      } else {
        setUserType(null);
      }
    });

    // Cleanup function to unsubscribe from auth state listener when the component is unmounted
    return () => unsubscribe();
  }, []);

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userType !== "hospital") {
      alert("Access Denied! Only hospital users can add patients.");
      return;
    }

    // Your patient adding logic here
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
        {userType === "hospital" ? (
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
                {superRooms.length === 0 ? (
                  <option disabled>No rooms available</option> // Show message if no rooms are available
                ) : (
                  superRooms.map((room, index) => (
                    <option key={index} value={room}>
                      {room}
                    </option>
                  ))
                )}
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
        ) : (
          <div className="text-gray-300">
            Access Denied! Only hospital users can add patients.
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default AddPatientsPage;
