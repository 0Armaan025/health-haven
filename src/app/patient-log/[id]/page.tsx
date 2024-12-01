"use client";
import React, { useEffect, useRef, useState } from "react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import html2canvas from "html2canvas";
import { DocumentReference, doc } from "firebase/firestore";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  getDoc,
  DocumentData,
} from "firebase/firestore";
import { auth, db } from "../../../firebase/firebaseConfig";
import { useParams } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";

const PatientLog: React.FC = () => {
  const { id } = useParams();
  const tableRef = useRef<HTMLDivElement>(null);
  const [patient, setPatient] = useState<DocumentData | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Function to download the patient log as an image
  const downloadAsImage = async (format: "jpg" | "png") => {
    if (!tableRef.current) return;

    const canvas = await html2canvas(tableRef.current);
    const dataUrl = canvas.toDataURL(`image/${format}`);
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `patient-log.${format}`;
    link.click();
  };

  useEffect(() => {
    const fetchPatientLog = async () => {
      try {
        setIsLoading(true);
        onAuthStateChanged(auth, async (user) => {
          if (!user) {
            setIsAuthorized(false);
            throw new Error("User not logged in.");
          }

          const userEmail = user.email;
          // const db = getFirestore();

          // Check if the logged-in user is a hospital type
          const usersRef = collection(db, "users");
          const userQuery = query(usersRef, where("email", "==", userEmail));
          const userSnapshot = await getDocs(userQuery);

          if (userSnapshot.empty) {
            setIsAuthorized(false);
            throw new Error("User not found.");
          }

          const userData = userSnapshot.docs[0].data();
          if (userData.type !== "hospital") {
            setIsAuthorized(false);
            throw new Error("Access denied: User is not a hospital.");
          }

          // Find the hospital where the user is a member
          const hospitalsRef = collection(db, "hospitals");
          const hospitalQuery = query(
            hospitalsRef,
            where("members", "array-contains", userEmail)
          );
          const hospitalSnapshot = await getDocs(hospitalQuery);

          if (hospitalSnapshot.empty) {
            setIsAuthorized(false);
            throw new Error("User is not associated with any hospital.");
          }

          const hospitalDoc = hospitalSnapshot.docs[0];
          const hospitalId = hospitalDoc.id;

          // Fetch the specific patient record from the hospital's patients subcollection
          if (!id) {
            throw new Error("Invalid patient ID.");
          }

          const patientRef = doc(
            db, // Firestore instance
            `hospitals/${hospitalId}/patients/${id}` // Full path as a single string
          );
          const patientDoc = await getDoc(patientRef);

          if (!patientDoc.exists()) {
            throw new Error("Patient record not found.");
          }

          setPatient(patientDoc.data());
          setIsAuthorized(true);
        });
      } catch (error) {
        console.error(
          error instanceof Error ? error.message : "An error occurred."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatientLog();
  }, [id]);

  if (isLoading)
    return <p className="text-center text-gray-100 mt-8">Loading...</p>;
  if (!isAuthorized)
    return <p className="text-center text-red-500 mt-8">Access Denied.</p>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 px-6 py-8 flex flex-col items-center">
        <h2 className="text-3xl font-semibold mb-6 text-red-500 font-poppins">
          Patient Log
        </h2>
        <div
          ref={tableRef}
          className="bg-gray-700 p-6 rounded-lg shadow-lg w-full max-w-xl"
        >
          <table className="w-full border-collapse border border-gray-600">
            <tbody>
              <tr className="bg-gray-800">
                <td className="border border-gray-600 px-4 py-2 font-semibold text-gray-300">
                  Patient Full Name
                </td>
                <td className="border border-gray-600 px-4 py-2">
                  {patient?.fullName || "N/A"}
                </td>
              </tr>
              <tr className="bg-gray-700">
                <td className="border border-gray-600 px-4 py-2 font-semibold text-gray-300">
                  Email
                </td>
                <td className="border border-gray-600 px-4 py-2">
                  {patient?.email || "N/A"}
                </td>
              </tr>
              <tr className="bg-gray-800">
                <td className="border border-gray-600 px-4 py-2 font-semibold text-gray-300">
                  Date and Time
                </td>
                <td className="border border-gray-600 px-4 py-2">
                  {patient?.createdAt
                    ? new Date(
                        patient.createdAt.seconds * 1000
                      ).toLocaleString()
                    : "N/A"}
                </td>
              </tr>
              <tr className="bg-gray-700">
                <td className="border border-gray-600 px-4 py-2 font-semibold text-gray-300">
                  Room
                </td>
                <td className="border border-gray-600 px-4 py-2">
                  {patient?.roomName || "N/A"}
                </td>
              </tr>
              <tr className="bg-gray-800">
                <td className="border border-gray-600 px-4 py-2 font-semibold text-gray-300">
                  Remarks by the Doctor
                </td>
                <td className="border border-gray-600 px-4 py-2">
                  {patient?.remarks || "N/A"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex justify-center mt-8 gap-4">
          <button
            onClick={() => downloadAsImage("jpg")}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-gray-100 font-semibold rounded-md transition-all"
          >
            Download as JPG
          </button>
          <button
            onClick={() => downloadAsImage("png")}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-gray-100 font-semibold rounded-md transition-all"
          >
            Download as PNG
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PatientLog;
