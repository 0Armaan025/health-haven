"use client";
import React, { useState, useEffect } from "react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import UserLeftSideBar from "@/components/user-left-side-bar/UserLeftSideBar";
import { db, auth } from "../../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc, getFirestore } from "firebase/firestore";

const UserDashboardPage: React.FC = () => {
  const [username, setUsername] = useState<string>(""); // To store the username
  const [editedUsername, setEditedUsername] = useState<string>(""); // For the editable username
  const [userEmail, setUserEmail] = useState<string | null>(null); // To store the signed-in user's email

  useEffect(() => {
    // Listen to the auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserEmail(user.email);
        await fetchUserData(user.email as any);
      } else {
        // Handle when the user is not signed in (if needed)
        setUserEmail(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch user data from Firestore when the user is signed in
  const fetchUserData = async (email: string) => {
    if (!email) return;

    const userDocRef = doc(db, "users", auth.currentUser?.uid as any); // Assuming email is the doc ID
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      setUsername(userData?.username || ""); // Set username from Firestore
      setEditedUsername(userData?.username || ""); // For editing purposes
    }
  };

  // Handle changes in the username input
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedUsername(e.target.value);
  };

  // Save the edited username to Firestore
  const handleSaveUsername = async () => {
    if (userEmail && editedUsername !== username) {
      const userDocRef = doc(db, "users", auth.currentUser?.uid as any); // Reference to the user's document in Firestore
      await updateDoc(userDocRef, { username: editedUsername });

      // Update the local state to reflect the changes
      setUsername(editedUsername);
    }
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
