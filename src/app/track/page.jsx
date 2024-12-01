"use client";
import React, { useEffect, useState, useRef } from "react";
import Script from "next/script";
import CameraFeed from "./CameraFeed";
import Navbar from "@/components/navbar/Navbar";
import { auth, db } from "../../firebase/firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
// import { useRouter } from "next/router";

const TrackPatientsPage = () => {
  const [predictions, setPredictions] = useState([]);
  const [predictionBuffer, setPredictionBuffer] = useState([]);
  const [showNoRoomWarning, setShowNoRoomWarning] = useState(false); // State to manage showing no room warning
  const isSendingAlert = useRef(false);
  const lastAlertTime = useRef(0); // Store the last alert time
  const bufferLimit = 10;
  // const router = useRouter(); // Used for navigation after alert

  // Firebase Firestore

  useEffect(() => {
    const initTeachableMachine = async () => {
      await loadScript(
        "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js"
      );
      await loadScript(
        "https://cdn.jsdelivr.net/npm/@teachablemachine/image@latest/dist/teachablemachine-image.min.js"
      );

      window.init = async () => {
        const URL = "https://teachablemachine.withgoogle.com/models/IMbZYBBnc/";

        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        window.model = await tmImage.load(modelURL, metadataURL);
        window.maxPredictions = window.model.getTotalClasses();

        const flip = true;
        window.webcam = new tmImage.Webcam(200, 200, flip);
        await window.webcam.setup();
        await window.webcam.play();

        window.requestAnimationFrame(window.loop);
      };

      window.loop = async () => {
        window.webcam.update();

        const prediction = await window.model.predict(window.webcam.canvas);

        const newPredictions = prediction.map((p) => ({
          className: p.className,
          probability: parseFloat(p.probability.toFixed(2)),
        }));
        setPredictions(newPredictions);

        setPredictionBuffer((prevBuffer) => {
          const updatedBuffer = [...prevBuffer, newPredictions];
          if (updatedBuffer.length >= bufferLimit) {
            analyzePredictions(updatedBuffer);
            return [];
          }
          return updatedBuffer;
        });

        window.requestAnimationFrame(window.loop);
      };
    };

    const loadScript = async (src) => {
      await new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = resolve;
        document.body.appendChild(script);
      });
    };

    const analyzePredictions = async (buffer) => {
      const predictionCounts = {};
      buffer.forEach((predictions) => {
        predictions.forEach((prediction) => {
          if (prediction.probability >= 0.8) {
            if (!predictionCounts[prediction.className]) {
              predictionCounts[prediction.className] = 0;
            }
            predictionCounts[prediction.className]++;
          }
        });
      });

      for (const [className, count] of Object.entries(predictionCounts)) {
        if (count >= bufferLimit / 2 && !isSendingAlert.current) {
          console.log("Consistent high prediction:", className);
          const currentTime = Date.now();
          if (currentTime - lastAlertTime.current > 30000) {
            // Check if 30 seconds have passed
            lastAlertTime.current = currentTime;
            isSendingAlert.current = true;
            await handleAlert(className);
          }
          break;
        }
      }
    };

    const handleAlert = async (className) => {
      const auth = getAuth();
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userRef);
          const userData = userDoc.data();

          if (userData?.type !== "hospital") {
            alert("Access Denied");
            return;
          }

          const hospitalsQuery = query(
            collection(db, "hospitals"),
            where("members", "array-contains", user.email)
          );
          const querySnapshot = await getDocs(hospitalsQuery);

          let hospitalDoc;
          querySnapshot.forEach((doc) => {
            hospitalDoc = doc.data();
          });

          if (!hospitalDoc) {
            alert("No associated hospital found.");
            return;
          }

          const hospitalCode = hospitalDoc.code;

          // Send critical alert
          const timestamp = new Date().toLocaleString();
          const alertData = {
            message: `Emergency, person on a ${className} approaching room`,
            timestamp: timestamp,
            title: `Alert, Patient approaching of type ${className}`,
            type: "critical",
          };
          const alertDocId = Date.now().toString(); // You can also use other unique identifiers

          await setDoc(
            doc(db, "hospitals", hospitalCode, "alerts", alertDocId),
            alertData
          );

          // Check rooms for matching conditions and update status
          const roomsRef = collection(db, "hospitals", hospitalCode, "rooms");
          const roomsQuery = query(
            roomsRef,
            where(
              "type",
              "==",
              className.toLowerCase() === "person on a wheelchair"
                ? "Wheelchair"
                : "Stretcher"
            ),
            where("status", "==", "Available")
          );
          const roomsSnapshot = await getDocs(roomsQuery);

          if (!roomsSnapshot.empty) {
            // Step 2: Get the room document and proceed with your logic
            const roomDoc = roomsSnapshot.docs[0]; // Assuming room_name is unique in your collection
            const roomData = roomDoc.data(); // Get the room data from the snapshot

            const coolClass =
              className.toLowerCase() === "person on a wheelchair"
                ? "Wheelchair"
                : "Stretcher";

            if (
              roomData.status === "Available" &&
              roomData.type === coolClass
            ) {
              // Send an alert for room assignment and update room status
              const roomAlert = {
                message: `Patient of type ${className} coming to room ${roomData.room_name}`,
                timestamp: timestamp,
                title: `Patient coming to room ${roomData.room_name}`,
                type: "critical",
              };

              // Set the alert document in the subcollection
              await setDoc(
                doc(
                  db,
                  "hospitals",
                  hospitalCode,
                  "rooms",
                  roomData.room_name, // Now we use the room_name to find the correct room document
                  "alerts",
                  timestamp
                ),
                roomAlert
              );

              // Update the room status to "occupied"
              await updateDoc(roomDoc.ref, {
                status: "Occupied",
              });
            } else {
              alert("No room available for the patient :(");
            }
          } else {
            alert("Room not found.");
          }
        }
      });
    };

    initTeachableMachine();
  }, []);

  const renderPredictions = () => {
    return predictions.map((prediction, index) => (
      <div key={index} className="prediction-bar">
        <div className="prediction-label">{prediction.className}</div>
        <div
          className="prediction-value"
          style={{ width: `${prediction.probability * 100}%` }}
        >
          {`${(prediction.probability * 100).toFixed(2)}%`}
        </div>
      </div>
    ));
  };

  return (
    <div className="trackPage bg-red-500">
      <Navbar />
      <div>
        <Script strategy="lazyOnload" id="1">
          {/* Additional scripts */}
        </Script>
        <div>
          <CameraFeed />
        </div>
        <div className="text-white font-bold ml-32 text-3xl mt-4">
          AI Predictor and Tracker (Patients)
        </div>
        <button
          type="button"
          onClick={() => window.init()}
          className="text-white bg-red-500 mb-8 hover:bg-red-600 transition-all cursor-pointer w-32 px-4 py-2 rounded-md ml-32 mt-8"
        >
          Start
        </button>
        {showNoRoomWarning && (
          <div className="text-red-500 ml-32 mt-4 text-4xl">
            No room available - WARNING!
          </div>
        )}
        <div id="webcam-container"></div>
        <div
          className="prediction-container text-white ml-8 mt-4"
          style={{ fontFamily: "Poppins" }}
        >
          {renderPredictions()}
        </div>
      </div>
    </div>
  );
};

export default TrackPatientsPage;
