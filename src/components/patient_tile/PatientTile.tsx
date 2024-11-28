"use client";
import React from "react";

type PatientProps = {
  patient: {
    name: string;
    timestamp: string;
    room: string;
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
          {patient.name}
        </h3>
        <p className="text-sm text-gray-400">{patient.timestamp}</p>
      </div>
      <p className="text-md font-semibold text-gray-200">{patient.room}</p>
    </div>
  );
};

export default PatientTile;
