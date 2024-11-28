import React from "react";
import './patientspage.css';
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/navbar/Footer";


const PatientsPage = () => {
  return (
    <>
      <Navbar/>
      <div className="patientsPage flex flex-col justify-center items-center">
      <h3 style={{fontFamily: "Poppins, sans-serif"}} className="text-3xl font-semibold text-white">Patients Log</h3>
      
      </div>
      <Footer/>
    </>
  );
}

export default PatientsPage;
