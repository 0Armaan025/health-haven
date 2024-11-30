"use client";
import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
  arrayUnion,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import "./staff.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

type StaffMember = {
  email: string;
  name: string;
};

const StaffPage: React.FC = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [hospitalDocId, setHospitalDocId] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const db = getFirestore();

    // Check if the user is authorized
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        alert("Access denied: User not logged in.");
        setIsLoading(false);
        return;
      }

      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnapshot = await getDoc(userDocRef);

        if (!userDocSnapshot.exists()) {
          alert("Access denied: User record not found.");
          setIsLoading(false);
          return;
        }

        const userData = userDocSnapshot.data();
        if (userData?.type !== "hospital") {
          alert("Access denied: You are not authorized to view this page.");
          setIsLoading(false);
          return;
        }

        // Find the hospital associated with the user
        const hospitalsRef = collection(db, "hospitals");
        const q = query(
          hospitalsRef,
          where("members", "array-contains", user.email)
        );
        const hospitalSnapshot = await getDocs(q);

        if (hospitalSnapshot.empty) {
          alert("Access denied: No associated hospital found.");
          setIsLoading(false);
          return;
        }

        const hospitalDoc = hospitalSnapshot.docs[0];
        setHospitalDocId(hospitalDoc.id);

        // Fetch staff members
        const hospitalData = hospitalDoc.data();
        const staffEmails = hospitalData.members || [];
        const staffList = await Promise.all(
          staffEmails.map(async (email: string) => {
            const userQuery = query(
              collection(db, "users"),
              where("email", "==", email)
            );
            const userSnapshot = await getDocs(userQuery);

            if (!userSnapshot.empty) {
              const userDoc = userSnapshot.docs[0];
              const userData = userDoc.data();
              return { email, name: userData?.name || "username" };
            }
            return { email, name: "Unknown" };
          })
        );

        setStaff(staffList);
        setIsAuthorized(true);
      } catch (error) {
        console.error("Error checking authorization:", error);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !hospitalDocId) return;

    const db = getFirestore();
    const hospitalRef = doc(db, "hospitals", hospitalDocId);

    try {
      // Add the new email to the hospital members array
      await updateDoc(hospitalRef, {
        members: arrayUnion(newEmail),
      });

      // Update the user's type to 'hospital' in the users collection
      const userQuery = query(
        collection(db, "users"),
        where("email", "==", newEmail)
      );
      const userSnapshot = await getDocs(userQuery);

      if (!userSnapshot.empty) {
        const userDoc = userSnapshot.docs[0];
        await updateDoc(userDoc.ref, {
          type: "hospital",
        });
      }

      // Add the new staff member to the local state
      setStaff((prev) => [...prev, { email: newEmail, name: "Fetching..." }]);
      setNewEmail("");
    } catch (error) {
      console.error("Error adding staff member:", error);
    }
  };

  const handleRemoveStaff = (email: string) => {
    setStaff(staff.filter((member) => member.email !== email));
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!isAuthorized) {
    return <h3>Access denied.</h3>;
  }

  return (
    <>
      <Navbar />
      <div className="staffPage min-h-screen flex flex-col items-center bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 px-4 py-8">
        <h3 className="text-3xl font-semibold mb-8 text-red-500 font-poppins">
          Hospital Staff
        </h3>

        {/* Add Staff Form */}
        <form
          onSubmit={handleAddStaff}
          className="w-full max-w-lg bg-gray-700 p-6 rounded-lg shadow-lg"
        >
          <h4 className="text-xl font-semibold mb-4 text-gray-100">
            Add Staff
          </h4>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Staff Email
              </label>
              <input
                type="email"
                id="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
                className="w-full p-3 rounded-md bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-gray-100 font-semibold rounded-md transition-all"
            >
              Add
            </button>
          </div>
        </form>

        {/* Staff List */}
        <div className="w-full max-w-3xl mt-12 bg-gray-700 p-6 rounded-lg shadow-lg mb-8">
          <h4 className="text-xl font-semibold mb-4 text-gray-100">
            Staff Members
          </h4>
          <ul>
            {staff.map((member, index) => (
              <li
                key={index}
                className="flex justify-between items-center py-2 border-b border-gray-600"
              >
                <div>
                  <span className="text-lg">{member.name}</span>
                  <span className="text-gray-400 block">{member.email}</span>
                </div>
                <button
                  onClick={() => handleRemoveStaff(member.email)}
                  className="text-red-500 hover:text-red-700 font-semibold transition-all"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default StaffPage;
