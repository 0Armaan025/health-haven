"use client";
import React from "react';
import './patienttile.css';

type PatientProps = {
  patient: {
    name: string;
    timestamp: string;
    room: string;
  };
};

const PatientTile: React.FC<PatientProps> = ({ alert }) => {
  

  return (
   <>
     <div className="patientTile flex flex-row justify-between items-center w-full mx-4 py-2 bg-[#dbdbdb]" >
       <h3>Patient Tile try</h3>
     </div>
   </>
  );
};

export default PatientTile;
