"use client";
import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebase/firebaseConfig";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import PatientTile from "@/components/patient_tile/PatientTile";
import Link from "next/link";

type Patient = {
  fullName: string;
  remarks: string;
  email: string;
  createdAt: string;
  docId: string;
  roomName: string;
};

const PatientsPage: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [docId, setDocId] = useState("");

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        alert("Access denied: User not logged in.");
        setIsLoading(false);
        return;
      }

      try {
        const userEmail = user.email;
        if (!userEmail) {
          console.error("User email not found.");
          setIsLoading(false);
          return;
        }

        // Query the `hospitals` collection for documents containing the user's email in the `members` array
        const hospitalsRef = collection(db, "hospitals");
        const hospitalsSnapshot = await getDocs(hospitalsRef);

        // Loop through all hospitals to check if the user's email exists in the `members` array
        let hospitalDocId = "";
        let hospitalCode = "";

        hospitalsSnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.members && data.members.includes(userEmail)) {
            hospitalDocId = doc.id; // Get the document ID
            setDocId(hospitalDocId);
            hospitalCode = data.code; // Get the code of the hospital
            // alert("some cool code is");
          }
        });

        if (!hospitalDocId || !hospitalCode) {
          alert("Access denied: You are not associated with any hospital.");
          setIsLoading(false);
          return;
        }

        setIsAuthorized(true);
        console.log("Hospital Code:", hospitalCode); // Debugging step

        // Fetch patients from the `patients` subcollection using the hospital code
        const patientsRef = collection(
          db,
          "hospitals",
          hospitalCode,
          "patients"
        );
        const patientsSnapshot = await getDocs(patientsRef);

        console.log("Fetched patients data:", patientsSnapshot.docs); // Debugging step
        if (patientsSnapshot.empty) {
          setPatients([]);
        } else {
          const patientsList: Patient[] = patientsSnapshot.docs.map((doc) => {
            const data = doc.data();
            console.log("Patient data:", data); // Log the fetched patient data for debugging
            return {
              docId: doc.id,
              fullName: data.fullName,
              createdAt: data.createdAt.toDate().toLocaleDateString(),
              roomName: data.roomName,
              email: data.email,
              remarks: data.remarks,
            };
          });
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
            className="text-xl font-semibold text-green-300 mb-3 underline cursor-pointer"
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
