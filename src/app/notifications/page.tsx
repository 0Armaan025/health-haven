"use client";
import "./alertpage.css";
import { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  onSnapshot,
  addDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import AlertComponent from "./AlertComponent";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

// Type for Alert
type Alert = {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  title: string;
};

const AlertsPage = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [hospitalCode, setHospitalCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newAlert, setNewAlert] = useState({
    type: "normal",
    title: "",
    message: "",
  });

  useEffect(() => {
    const db = getFirestore();

    // Listener for authentication state changes
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      console.log("Auth state changed:", user);

      if (!user) {
        alert("User not logged in!");
        setIsLoading(false);
        return;
      }

      try {
        // Step 1: Fetch user document and check type
        const userDocRef = doc(db, "users", user.uid);
        const unsubscribeUser = onSnapshot(userDocRef, async (docSnapshot) => {
          const userData = docSnapshot.data();
          if (!userData || userData.type !== "hospital") {
            alert("You are not authorized to view alerts.");
            setIsLoading(false);
            unsubscribeUser(); // Cleanup user listener
            return;
          }

          // Step 2: Find hospital code
          const hospitalsRef = collection(db, "hospitals");
          const hospitalsSnapshot = await getDocs(hospitalsRef);

          let code = null;
          for (const hospitalDoc of hospitalsSnapshot.docs) {
            const hospitalData = hospitalDoc.data();
            if (hospitalData.members.includes(user.email)) {
              code = hospitalData.code;
              break;
            }
          }

          if (!code) {
            alert("No associated hospital found.");
            setIsLoading(false);
            unsubscribeUser(); // Cleanup user listener
            return;
          }

          setHospitalCode(code);

          // Step 3: Fetch alerts from the hospital subcollection
          const alertsRef = collection(doc(db, "hospitals", code), "alerts");
          const unsubscribeAlerts = onSnapshot(alertsRef, (alertsSnapshot) => {
            if (alertsSnapshot.empty) {
              console.log("No alerts found.");
              setAlerts([]); // No alerts found
            } else {
              const fetchedAlerts: Alert[] = alertsSnapshot.docs.map(
                (alertDoc) => ({
                  ...(alertDoc.data() as Alert),
                  id: alertDoc.id,
                })
              );
              setAlerts(fetchedAlerts);
            }
            setIsLoading(false); // Done loading after fetching alerts
          });

          // Cleanup for alerts listener
          return () => unsubscribeAlerts();
        });

        // Cleanup for user listener
        return () => unsubscribeUser();
      } catch (error) {
        console.error("Error fetching alerts:", error);
        setIsLoading(false);
      }
    });

    // Cleanup for auth listener
    return () => unsubscribeAuth();
  }, []);

  // Handle form input changes for the new alert
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAlert((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle alert type change (normal or critical)
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewAlert((prev) => ({
      ...prev,
      type: e.target.value,
    }));
  };

  // Add new alert to Firestore
  const handleAddAlert = async () => {
    const db = getFirestore();
    try {
      const alertsRef = collection(
        doc(db, "hospitals", hospitalCode!),
        "alerts"
      );
      await addDoc(alertsRef, {
        ...newAlert,
        timestamp: new Date().toISOString(),
      });
      setShowModal(false); // Close the modal after submitting
      setNewAlert({ type: "normal", title: "", message: "" }); // Reset form
    } catch (error) {
      console.error("Error adding alert:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white font-poppins flex flex-col">
      {/* Use Navbar component */}
      <Navbar />

      {/* Alerts Page Content */}
      <div className="flex-grow p-6">
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 mb-6"
        >
          Send Alert
        </button>

        {isLoading ? (
          <p>Loading...</p> // Display loading state while fetching data
        ) : alerts.length === 0 ? (
          <p className="text-white text-center">No alerts present.</p> // If no alerts are available, show this message
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {alerts.map((alert) => (
              <AlertComponent key={alert.id} alert={alert} />
            ))}
          </div>
        )}
      </div>

      {/* Add Alert Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-xl font-semibold mb-4">Create Alert</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Alert Type
              </label>
              <select
                name="type"
                value={newAlert.type}
                onChange={handleTypeChange}
                className="w-full p-2 border text-black rounded-md"
              >
                <option value="normal">Normal</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                name="title"
                value={newAlert.title}
                onChange={handleInputChange}
                className="w-full p-2 border text-black rounded-md"
                placeholder="Enter alert title"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea
                name="message"
                value={newAlert.message}
                onChange={handleInputChange as any}
                className="w-full p-2 border text-black rounded-md"
                placeholder="Enter alert message"
              ></textarea>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleAddAlert}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 mr-2"
              >
                Add Alert
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Use Footer component */}
      <Footer />
    </div>
  );
};

export default AlertsPage;
