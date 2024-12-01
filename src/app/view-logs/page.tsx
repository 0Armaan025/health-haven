"use client";
import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebase/firebaseConfig";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import {
  collection,
  query,
  where,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { format } from "date-fns"; // You can use date-fns to format timestamps

type PatientLog = {
  date: string;
  fullName: string;
  email: string;
  time: string;
  room: string;
  remarks: string;
  docId: string; // Add docId to the PatientLog type
};

const ViewLogsPage: React.FC = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [logsData, setLogsData] = useState<PatientLog[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [filteredLogs, setFilteredLogs] = useState<PatientLog[]>(logsData);

  useEffect(() => {
    // Get the signed-in user's email
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserEmail(user.email);
        await fetchPatientLogs(user.email as any);
      } else {
        alert("user not logged in");
        window.location.href = "/";
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch patient logs from all hospital subcollections
  const fetchPatientLogs = async (email: string) => {
    const hospitalsRef = collection(db, "hospitals");
    const hospitalsSnapshot = await getDocs(hospitalsRef);
    const allLogs: PatientLog[] = [];

    // Loop through all hospital documents
    for (const hospitalDoc of hospitalsSnapshot.docs) {
      const patientsRef = collection(hospitalDoc.ref, "patients");
      const patientsSnapshot = await getDocs(patientsRef);

      // Loop through all patient records in each hospital
      patientsSnapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (data.email === email) {
          // Format the createdAt timestamp to a readable date string
          const formattedDate = format(data.createdAt.toDate(), "yyyy-MM-dd");
          const log: PatientLog = {
            date: formattedDate,
            fullName: data.fullName,
            email: data.email,
            time: format(data.createdAt.toDate(), "hh:mm a"),
            room: data.roomName,
            remarks: data.remarks,
            docId: doc.id, // Store the docId of each patient log
          };
          allLogs.push(log);
        }
      });
    }

    setLogsData(allLogs);
    setFilteredLogs(allLogs); // Initially, show all logs
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setSelectedDate(date);

    if (date) {
      const filtered = logsData.filter((log) => log.date === date);
      setFilteredLogs(filtered);
    } else {
      setFilteredLogs(logsData);
    }
  };

  // Handle the click on a specific log row
  const handleRowClick = (docId: string) => {
    window.location.href = `/patient-log/${docId}`; // Navigate to the patient log page with the docId
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 px-6 py-8 flex flex-col items-center">
        <h2 className="text-3xl font-semibold mb-6 text-red-500 font-poppins">
          View Your Logs
        </h2>

        {/* Date Picker */}
        <div className="w-full max-w-md bg-gray-700 p-6 rounded-lg shadow-lg mb-6">
          <h4 className="text-xl font-semibold mb-4 text-gray-100">
            Select Date
          </h4>
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="w-full p-3 rounded-md bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Logs Table */}
        <div className="w-full max-w-4xl bg-gray-700 p-6 rounded-lg shadow-lg">
          <h4 className="text-xl font-semibold mb-4 text-gray-100">
            {selectedDate ? `Logs for ${selectedDate}` : "All Logs"}
          </h4>
          {filteredLogs.length > 0 ? (
            <table className="w-full border-collapse border border-gray-600">
              <thead>
                <tr className="bg-gray-800">
                  <th className="border border-gray-600 px-4 py-2 text-gray-300">
                    Date
                  </th>
                  <th className="border border-gray-600 px-4 py-2 text-gray-300">
                    Time
                  </th>
                  <th className="border border-gray-600 px-4 py-2 text-gray-300">
                    Room
                  </th>
                  <th className="border border-gray-600 px-4 py-2 text-gray-300">
                    Remarks
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log, index) => (
                  <tr
                    key={log.docId} // Use docId as the key
                    className={`${
                      index % 2 === 0
                        ? "bg-gray-800 cursor-pointer"
                        : "bg-gray-700 cursor-pointer "
                    }`}
                    onClick={() => handleRowClick(log.docId)} // Add click handler to navigate
                  >
                    <td className="border border-gray-600 px-4 py-2">
                      {log.date}
                    </td>
                    <td className="border border-gray-600 px-4 py-2">
                      {log.time}
                    </td>
                    <td className="border border-gray-600 px-4 py-2">
                      {log.room}
                    </td>
                    <td className="border border-gray-600 px-4 py-2">
                      {log.remarks}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-400 mt-4">
              No logs found for the selected date.
            </p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ViewLogsPage;
