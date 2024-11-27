"use client";
import React, { useState } from "react";
import "./alertpage.css";
import AlertComponent from "./AlertComponent";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

type Alert = {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  title: string;
};

const AlertsPage = () => {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "1",
      type: "normal",
      message: "Potential oxygen shortage predicted in ICU.",
      timestamp: "10:45 AM",
      title: "Resource Prediction",
    },
    {
      id: "2",
      type: "critical",
      message: "Emergency in Room 202: Code Red!",
      timestamp: "11:00 AM",
      title: "Critical Alert",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAlert, setNewAlert] = useState({
    type: "",
    title: "",
    message: "",
  });

  const handleSendAlert = () => {
    if (!newAlert.type || !newAlert.title || !newAlert.message) {
      alert("All fields are required!");
      return;
    }

    const timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setAlerts([
      ...alerts,
      { id: String(alerts.length + 1), ...newAlert, timestamp },
    ]);
    setIsModalOpen(false);
    setNewAlert({ type: "", title: "", message: "" });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-8 font-poppins alertPage">
        <div className="flex justify-between items-center mb-8">
          <h1
            className="text-4xl font-semibold text-white"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Alerts
          </h1>
          <button
            className="px-6 py-3 cursor-pointer bg-[#dc2526] text-white rounded-lg shadow-lg hover:bg-[#940a0a] transition-all"
            onClick={() => setIsModalOpen(true)}
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Send an alert
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {alerts.map((alert) => (
            <AlertComponent key={alert.id} alert={alert} />
          ))}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-[#1d1b1b] p-6 rounded-lg shadow-lg w-96">
              <h2
                className="text-2xl font-bold mb-4 text-gray-200"
                style={{ fontFamily: "monospace" }}
              >
                Send Alert
              </h2>
              <form className="space-y-4">
                <select
                  className="w-full px-4 py-2 border border-black rounded-lg focus:outline-none bg-gray-800 text-white"
                  value={newAlert.type}
                  onChange={(e) =>
                    setNewAlert({ ...newAlert, type: e.target.value })
                  }
                >
                  <option value="">Select Type</option>

                  <option value="normal">Normal</option>
                  <option value="critical">Critical</option>
                </select>
                <input
                  type="text"
                  placeholder="Title"
                  className="w-full px-4 py-2 bg-gray-800 text-white border border-black rounded-lg focus:outline-none"
                  value={newAlert.title}
                  onChange={(e) =>
                    setNewAlert({ ...newAlert, title: e.target.value })
                  }
                />
                <textarea
                  placeholder="Message"
                  className="w-full px-4 py-2 bg-gray-800 text-white border border-black rounded-lg focus:outline-none"
                  value={newAlert.message}
                  onChange={(e) =>
                    setNewAlert({ ...newAlert, message: e.target.value })
                  }
                />
              </form>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                  onClick={handleSendAlert}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default AlertsPage;
