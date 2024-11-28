import React from "react";
import './patientspage.css';
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/navbar/Footer";

type Patient = {
  name: string;
  timestamp: string;
  room: string;
};

const PatientsPage = () => {
  const [patient, setPatients] = useState<Patient[]>([
    {
      name: "Armaan",
      timestamp: "10:45 AM",
      room: "ROOM 102",
    },
    {
      name: "Armaan 2",
      timestamp: "10:45 AM",
      room: "ROOM 104",
    },
  ]);
  return (
    <>
      <Navbar/>
      <div className="patientsPage flex flex-col justify-center items-center">
      <h3 style={{fontFamily: "Poppins, sans-serif"}} className="text-3xl font-semibold text-white">Patients Log</h3>
{/*       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {alerts.map((alert) => (
            <AlertComponent key={alert.id} alert={alert} />
          ))}
        </div> */}
      </div>
      <Footer/>
    </>
  );
}

export default PatientsPage;
