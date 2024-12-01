"use client";
import React, { useState, useEffect } from "react";
import { auth, db } from "../../firebase/firebaseConfig";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
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
      if (!user) {
        setUserType(null);
        return;
      }

      const userEmail = user.email;
      setEmail(userEmail || "");

      try {
        // Reference the "hospitals" collection
        const hospitalsRef = collection(db, "hospitals");

        // Query for the hospital document where "members" array contains the user's email
        const hospitalsQuery = query(
          hospitalsRef,
          where("members", "array-contains", userEmail)
        );
        const querySnapshot = await getDocs(hospitalsQuery);

        if (querySnapshot.empty) {
          console.log("No hospital document found for this user.");
          setUserType("other");
          return;
        }

        // Get the first matching document (assuming one hospital per user)
        const hospitalDoc = querySnapshot.docs[0];
        const hospitalData = hospitalDoc.data();

        // Extract the "code" field
        const hospitalCode = hospitalData?.code;

        if (!hospitalCode) {
          console.error("Hospital code not found in the document.");
          setUserType("other");
          return;
        }

        console.log("Hospital Code:", hospitalCode);

        // Fetch rooms from the "rooms" subcollection within the hospital document
        const roomsRef = collection(db, "hospitals", hospitalDoc.id, "rooms");
        const roomsSnapshot = await getDocs(roomsRef);

        const availableRooms: string[] = [];
        roomsSnapshot.forEach((roomDoc) => {
          const roomData = roomDoc.data();
          if (roomData?.room_name) {
            availableRooms.push(roomData.room_name);
            setSuperRooms([...superRooms, roomData.room_name]); // Fix: Use spread operator to add new room name to superRooms array
          }
        });

        console.log("Available Rooms:", availableRooms);
        setRooms(availableRooms); // Set available rooms for selection
        setUserType("hospital");
      } catch (error) {
        console.error("Error fetching hospital/rooms data:", error);
        setUserType(null);
      }
    });

    // Cleanup the subscription
    return () => unsubscribe();
  }, []);

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();

    if (userType !== "hospital") {
      alert("Access Denied! Only hospital users can add patients.");
      return;
    }

    try {
      // Reference the hospitals collection
      const hospitalsRef = collection(db, "hospitals");
      
      const hospitalsQuery = query(
        hospitalsRef,
        where("members", "array-contains", auth.currentUser?.email)
      );
      const querySnapshot = await getDocs(hospitalsQuery);

      if (querySnapshot.empty) {
        alert("Hospital document not found for this user. Access denied.");
        return;
      }

      // Fetch the first hospital document that matches the query
      const hospitalDoc = querySnapshot.docs[0];
      const hospitalData = hospitalDoc.data();

      if (!hospitalData?.code) {
        console.error("No hospital code found in the document.");
        alert(
          "An error occurred while verifying hospital data. Access denied."
        );
        return;
      }

      const hospitalCode = hospitalData.code; // Retrieve the code field

      // Add the patient to the 'patients' subcollection within the hospital document
      const patientsRef = collection(db, "hospitals", hospitalCode, "patients");

      await addDoc(patientsRef, {
        fullName,
        email,
        roomName,
        remarks,
        createdAt: new Date(), // Timestamp for when the patient was added
      });

      console.log("Patient added successfully to Firestore.");
      alert("Patient added successfully!");

      // Reset only specific fields of the form
      setFullName("");
      setRoomName("");
      setRemarks("");
    } catch (error) {
      console.error("Error adding patient:", error);
      alert("An error occurred while adding the patient. Please try again.");
    }
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
