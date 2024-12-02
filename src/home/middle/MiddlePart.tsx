import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css"; // Import the AOS styles
import "./middlepart.css";
import { onAuthStateChanged } from "firebase/auth";

import { auth, db } from "../../firebase/firebaseConfig";
import Link from "next/link";

const MiddlePart = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        console.log("User logged in:", currentUser);
      } else {
        setUser(null);
        console.log("No user logged in");
      }
    });
    AOS.init({
      duration: 1000, // Animation duration
      once: true, // Animation will only happen once
    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, []);

  return (
    <div className="middlePart">
      {/* Headline Section */}
      <h2
        className="headlineText text-gray-300 text-3xl md:text-4xl lg:text-5xl font-bold text-center"
        data-aos="fade-up"
      >
        Hospital Room Management <br />
        <span className="highlight text-yellow-400">Made Easy</span> with AI
      </h2>
      <p
        className="subHeading text-gray-400 text-sm md:text-base lg:text-lg max-w-2xl mx-auto mt-4"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        Streamlining patient care with AI precision, automated room bookings,
        alerts/notifications, and patient management!
      </p>

      {/* Button Section */}
      <div className="mt-8" data-aos="fade-up" data-aos-delay="400">
        <Link href="/login">
        <button className="getStartedBtn px-8 py-3 text-sm md:text-base lg:text-lg">
          Get Started Now ➜
        </button>
        </Link>
      </div>

      {/* Card Section */}
      <div className="cardsContainer flex flex-wrap justify-center gap-6 mt-10">
        <div
          className="card w-72 md:w-80 lg:w-96"
          data-aos="fade-up"
          data-aos-delay="600"
        >
          <img
            src="https://img.freepik.com/free-vector/tiny-doctors-patients-near-hospital-flat-vector-illustration-therapist-face-mask-saying-goodbye-cured-people-near-medical-building-ambulance-emergency-clinic-concept_74855-25338.jpg?semt=ais_hybrid"
            alt="Image 1"
            className="cardImage"
          />
        </div>
        <div
          className="card w-72 md:w-80 lg:w-96"
          style={{ marginTop: "30px" }}
          data-aos="fade-up"
          data-aos-delay="800"
        >
          <img
            src="https://img.freepik.com/premium-photo/white-robot-hospital-room-pointing-towards-bed_255669-15401.jpg"
            alt="Image 2"
            className="cardImage"
          />
        </div>
        <div
          className="card w-72 md:w-80 lg:w-96"
          data-aos="fade-up"
          data-aos-delay="1000"
        >
          <img
            src="https://img.freepik.com/premium-photo/doctor-standing-near-hospital-bed-ai-generated_145713-7511.jpg"
            alt="Image 3"
            className="cardImage"
          />
        </div>
      </div>
    </div>
  );
};

export default MiddlePart;
