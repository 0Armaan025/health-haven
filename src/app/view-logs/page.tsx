"use client";
import React, { useState } from "react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

type PatientLog = {
  date: string;
  fullName: string;
  email: string;
  time: string;
  room: string;
  remarks: string;
};

const logsData: PatientLog[] = [
  {
    date: "2024-11-28",
    fullName: "John Doe",
    email: "john.doe@example.com",
    time: "10:30 AM",
    room: "Room 101",
    remarks: "Stable condition. Regular monitoring advised.",
  },
  {
    date: "2024-11-27",
    fullName: "John Doe",
    email: "john.doe@example.com",
    time: "3:15 PM",
    room: "Room 102",
    remarks: "Slight improvement in vitals. Continue medication.",
  },
  {
    date: "2024-11-26",
    fullName: "John Doe",
    email: "john.doe@example.com",
    time: "9:00 AM",
    room: "Room 103",
    remarks: "Initial checkup completed. Awaiting test results.",
  },
];

const ViewLogsPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [filteredLogs, setFilteredLogs] = useState<PatientLog[]>(logsData);

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
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"
                    }`}
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
