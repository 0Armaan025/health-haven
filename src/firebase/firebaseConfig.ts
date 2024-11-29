// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCo-xwzCRgGNh8MKfG8pO15vlI62kgRuMk",
  authDomain: "health-haven-00d.firebaseapp.com",
  projectId: "health-haven-00d",
  storageBucket: "health-haven-00d.firebasestorage.app",
  messagingSenderId: "1066132031178",
  appId: "1:1066132031178:web:2df78197e9912ee7471633",
  measurementId: "G-D6NB13SNTM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
