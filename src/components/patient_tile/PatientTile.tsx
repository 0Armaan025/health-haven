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
     <div className="patientTile">
       
     </div>
   </>
  );
};

export default PatientTile;
