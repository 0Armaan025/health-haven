"use client";
import React from "react";

type PatientProps = {
  patient: {
    fullName: string;
    remarks: string;
    roomName: string;
    email: string;
    createdAt: string; // Expecting a formatted string here
  };
};

const PatientTile: React.FC<PatientProps> = ({ patient }) => {
  return (
    <div className="flex flex-row justify-between cursor-pointer hover:scale-105 transition-all items-center w-full mb-4 p-4 bg-gray-700 rounded-lg shadow-lg hover:shadow-xl ">
      <div>
        <h3
          className="text-lg font-bold text-red-300"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          {patient.fullName}
        </h3>
        <p className="text-sm text-gray-400">{patient.createdAt}</p>
      </div>
      <p className="text-md font-semibold text-gray-200">{patient.roomName}</p>
    </div>
  );
};

export default PatientTile;
