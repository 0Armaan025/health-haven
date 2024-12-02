"use client";
import React, { useState, useEffect } from "react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import UserLeftSideBar from "@/components/user-left-side-bar/UserLeftSideBar";
import { auth, db } from "../../firebase/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";

const UserDashboardPage: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [editedUsername, setEditedUsername] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    // Listen to the auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserEmail(user.email);
        await fetchUserData(user.uid);
      } else {
        setUserEmail(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch user data from Firestore
  const fetchUserData = async (uid: string) => {
    if (!uid) return;
    try {
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUsername(userData?.username || "");
        setEditedUsername(userData?.username || "");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Handle username input change
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedUsername(e.target.value);
  };

  // Save the edited username to Firestore
  const handleSaveUsername = async () => {
    if (userEmail && editedUsername && editedUsername !== username) {
      try {
        const userDocRef = doc(db, "users", auth.currentUser?.uid as string);
        await updateDoc(userDocRef, { username: editedUsername });
        setUsername(editedUsername); // Update local state
      } catch (error) {
        console.error("Error updating username:", error);
      }
    }
  };

  // Handle user logout
  const handleLogout = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        // Optional: Delete user data from Firestore if necessary
        await signOut(auth);
        window.location.href = "/login"; // Redirect to login page
      } catch (error) {
        console.error("Error during logout:", error);
      }
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
            <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>
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
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-red-500 text-gray-100 rounded-md hover:bg-red-600"
            >
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
