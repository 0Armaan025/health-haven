"use client";
import React, { useRef } from "react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import html2canvas from "html2canvas";

const PatientLog: React.FC = () => {
  const tableRef = useRef<HTMLDivElement>(null);

  // Patient details
  const patient = {
    fullName: "John Doe",
    email: "john.doe@example.com",
    dateTime: "2024-11-28 10:30 AM",
    room: "Room 101",
    remarks: "Stable condition. Regular monitoring advised.",
  };

  // Function to download table as an image
  const downloadAsImage = async (format: "jpg" | "png") => {
    if (!tableRef.current) return;

    const canvas = await html2canvas(tableRef.current);
    const dataUrl = canvas.toDataURL(`image/${format}`);
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `patient-log.${format}`;
    link.click();
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 px-6 py-8 flex flex-col items-center">
        <h2 className="text-3xl font-semibold mb-6 text-red-500 font-poppins">
          Your Patient Log
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
                  {patient.fullName}
                </td>
              </tr>
              <tr className="bg-gray-700">
                <td className="border border-gray-600 px-4 py-2 font-semibold text-gray-300">
                  Email
                </td>
                <td className="border border-gray-600 px-4 py-2">
                  {patient.email}
                </td>
              </tr>
              <tr className="bg-gray-800">
                <td className="border border-gray-600 px-4 py-2 font-semibold text-gray-300">
                  Date and Time
                </td>
                <td className="border border-gray-600 px-4 py-2">
                  {patient.dateTime}
                </td>
              </tr>
              <tr className="bg-gray-700">
                <td className="border border-gray-600 px-4 py-2 font-semibold text-gray-300">
                  Room
                </td>
                <td className="border border-gray-600 px-4 py-2">
                  {patient.room}
                </td>
              </tr>
              <tr className="bg-gray-800">
                <td className="border border-gray-600 px-4 py-2 font-semibold text-gray-300">
                  Remarks by the Doctor
                </td>
                <td className="border border-gray-600 px-4 py-2">
                  {patient.remarks}
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
