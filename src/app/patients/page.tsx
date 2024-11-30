"use client";
import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import PatientTile from "@/components/patient_tile/PatientTile";
import Link from "next/link";

type Patient = {
  name: string;
  timestamp: string;
  room: string;
};

const PatientsPage: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const db = getFirestore();

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        alert("Access denied: User not logged in.");
        setIsLoading(false);
        return;
      }

      try {
        // Check if the user is authorized (hospital user)
        const userRef = collection(db, "users"); // Assuming users are stored in the 'users' collection
        const userDocs = await getDocs(userRef);
        let authorized = false;
        userDocs.forEach((doc) => {
          if (doc.id === user.uid && doc.data().type === "hospital") {
            authorized = true;
          }
        });

        if (!authorized) {
          alert("Access denied: You are not authorized to view this page.");
          setIsLoading(false);
          return;
        }

        setIsAuthorized(true);

        // Fetch patients from Firestore
        const patientsRef = collection(db, "patients");
        const patientsSnapshot = await getDocs(patientsRef);

        if (patientsSnapshot.empty) {
          setPatients([]);
        } else {
          const patientsList: Patient[] = patientsSnapshot.docs.map((doc) => ({
            name: doc.data().name,
            timestamp: doc.data().timestamp,
            room: doc.data().room,
          }));
          setPatients(patientsList);
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!isAuthorized) {
    return <p>Access denied.</p>;
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-8">
        <h3 className="text-4xl font-bold text-red-500 mb-3">Patients Log</h3>

        <Link href="/add-patient">
          <h4
            className="text-xl font-semiobold text-green-300 mb-3 underline cursor-pointer"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Add new record...
          </h4>
        </Link>

        {patients.length > 0 ? (
          <div className="w-full max-w-4xl space-y-4">
            {patients.map((patient, index) => (
              <PatientTile key={index} patient={patient} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-lg">No data yet.</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default PatientsPage;
