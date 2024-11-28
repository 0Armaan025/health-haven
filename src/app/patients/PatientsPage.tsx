"use client";
import React, { useState } from "react";
import Navbar from "@/components/navbar/Navbar";
import redirect from "next/navigation";
import Footer from "@/components/footer/Footer";
import PatientTile from "@/components/patient_tile/PatientTile";
import { Patient } from "./page";

export const PatientsPage: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([
    {
      name: "Armaan",
      timestamp: "14th December, 2024 10:45 AM",
      room: "ROOM 102",
    },
    {
      name: "Armaan 2",
      timestamp: "8th December, 2024 10:45 AM",
      room: "ROOM 104",
    },
  ]);

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-8">
        <h3 className="text-4xl font-bold text-red-500 mb-3">Patients Log</h3>

        <h4
          className="text-xl font-semiobold text-green-300 mb-3 underline cursor-pointer"
          onClick={() => {
            redirect("/add-patient");
          }}
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          Add new record...
        </h4>
        <div className="w-full max-w-4xl space-y-4">
          {patients.map((patient, index) => (
            <PatientTile key={index} patient={patient} />
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};
