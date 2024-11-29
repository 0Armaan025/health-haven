"use client";
import Navbar from "@/components/navbar/Navbar";
import "./signuppage.css";
import React, { useState, useEffect } from "react";
import Footer from "@/components/footer/Footer";
import AOS from "aos";
import { auth, db } from "../../firebase/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, collection } from "firebase/firestore";
import "aos/dist/aos.css";
import Link from "next/link";

const SignUpPage: React.FC = () => {
const [step, setStep] = useState(1);
const [userType, setUserType] = useState(""); // "individual" or "hospital"
const [formData, setFormData] = useState({
  username: "",
  email: "",
  password: "",
  hospitalName: "",
  hospitalCode: "",
  hospitalAddress: "",
});

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormData((prevData) => ({
    ...prevData,
    [name]: value,
  }));
};

const handleNextStep = () => {
  // For username step (step 1), allow progression to next step without validation
  if (step === 1) {
    setStep(2);
    return;
  }

  // For email step (step 2), validate email before progressing
  if (step === 2 && formData.email.trim() === "") {
    alert("Email is required!");
    return;
  }

  // For password step (step 3), validate password before progressing
  if (step === 3 && formData.password.trim() === "") {
    alert("Password is required!");
    return;
  }

  // For hospital type user (step 4), no validation needed at this point
  if (step === 4) {
    setStep(5); // Skip to hospital details step if hospital
    return;
  }

  // For hospital details step (step 5), validate hospital name, code, and address
  if (step === 5) {
    if (userType === "hospital") {
      if (formData.hospitalName.trim() === "") {
        alert("Hospital name is required!");
        return;
      }
      if (formData.hospitalCode.trim() === "") {
        alert("Hospital code is required!");
        return;
      }
      if (formData.hospitalAddress.trim() === "") {
        alert("Hospital address is required!");
        return;
      }
    }
    handleSubmit(); // All validations passed, submit form
  } else {
    setStep(step + 1); // Move to the next step for other cases
  }
};

const handleUserTypeChange = async (type: string) => {
  setUserType(type);
  if (type === "individual") {
    setFormData((prevData) => ({
      ...prevData,
      hospitalName: "",
      hospitalCode: "",
      hospitalAddress: "",
    }));
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      formData.email,
      formData.password
    );
    const user = userCredential.user;

    const userData = {
      username: formData.username,
      email: formData.email,
      type: "individual", // 'individual' or 'hospital'
    };

    // Add user details to Firestore under "users" collection
    await setDoc(doc(db, "users", user.uid), userData).then(() => {
      window.location.href = "/dashboard";
    });
  } else {
    setStep(4); // Go to hospital details step (step 4) for hospital staff
  }
};

const handleSubmit = async () => {
  if (!formData.email || !formData.password || !formData.username) {
    alert("Please fill all required fields!");
    return;
  }

  if (
    userType === "hospital" &&
    (!formData.hospitalName ||
      !formData.hospitalCode ||
      !formData.hospitalAddress)
  ) {
    alert("Please provide all hospital details!");
    return;
  }

  try {
    // Create the user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      formData.email,
      formData.password
    );
    const user = userCredential.user;

    // Prepare Firestore user data
    const userData = {
      username: formData.username,
      email: formData.email,
      type: userType, // 'individual' or 'hospital'
    };

    // Add user details to Firestore under "users" collection
    await setDoc(doc(db, "users", user.uid), userData);

    if (userType === "hospital") {
      // Add hospital details to a new document in the "hospitals" collection
      const hospitalData = {
        name: formData.hospitalName,
        code: formData.hospitalCode,
        address: formData.hospitalAddress,
        members: [formData.email], // Initialize with the current hospital staff's email
      };

      await setDoc(doc(db, "hospitals", formData.hospitalCode), hospitalData);
    }

    alert("Account created successfully!");
  } catch (error: any) {
    console.error("Error during signup:", error);
    alert(error.message || "Failed to create account. Please try again.");
  }
};

useEffect(() => {
  AOS.init({
    duration: 1000,
    easing: "ease-in-out",
    once: true,
  });
}, []);

return (
  <>
    <Navbar />
    <div className="signUpPage relative min-h-screen overflow-hidden flex items-center justify-center bg-dark-gray">
      <div
        className="absolute inset-0 bg-cover bg-center bg-opacity-50"
        style={{ backgroundImage: "url('../../public/bg.jpg')" }}
      ></div>
      <div className="relative z-10 p-8 max-w-xl mx-auto bg-[#442929] rounded-xl shadow-lg backdrop-blur-xl">
        <h2
          className="text-3xl font-bold text-center text-white mb-4"
          style={{ fontFamily: "Poppins" }}
          data-aos="fade-up"
        >
          Join Us
        </h2>
        <p
          className="text-center text-gray-200 mb-6"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          Create your account with the steps below or{" "}
          <Link href="/login" className="text-red-400 underline">
            log in here
          </Link>
          .
        </p>

        <form className="space-y-6">
          {/* Step 1: Username */}
          {step === 1 && (
            <div
              className="transition-transform transform hover:scale-105"
              data-aos="fade-up"
            >
              <label className="block text-gray-200 font-medium mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          {/* Step 2: Email */}
          {step === 2 && (
            <div
              className="transition-transform transform hover:scale-105"
              data-aos="fade-up"
            >
              <label className="block text-gray-200 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          {/* Step 3: Password */}
          {step === 3 && (
            <div
              className="transition-transform transform hover:scale-105"
              data-aos="fade-up"
            >
              <label className="block text-gray-200 font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          {/* Step 4: User Type Selection */}
          {step === 4 && (
            <div
              className="transition-transform transform hover:scale-105"
              data-aos="fade-up"
            >
              <label className="block text-gray-200 font-medium mb-2">
                Are you an individual or hospital staff?
              </label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  className={`${
                    userType === "individual" ? "bg-red-600" : "bg-gray-500"
                  } text-white px-4 py-2 rounded-lg`}
                  onClick={() => handleUserTypeChange("individual")}
                >
                  Individual
                </button>
                <button
                  type="button"
                  className={`${
                    userType === "hospital" ? "bg-red-600" : "bg-gray-500"
                  } text-white px-4 py-2 rounded-lg`}
                  onClick={() => handleUserTypeChange("hospital")}
                >
                  Hospital Staff
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Hospital Details (If Hospital Staff) */}
          {userType === "hospital" && step === 5 && (
            <div
              className="transition-transform transform hover:scale-105"
              data-aos="fade-up"
            >
              <label className="block text-gray-200 font-medium mb-2">
                Hospital Name
              </label>
              <input
                type="text"
                name="hospitalName"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                value={formData.hospitalName}
                onChange={handleInputChange}
                required
              />
              <label className="block text-gray-200 font-medium mb-2 mt-4">
                Hospital Code
              </label>
              <input
                type="text"
                name="hospitalCode"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                value={formData.hospitalCode}
                onChange={handleInputChange}
                required
              />
              <label className="block text-gray-200 font-medium mb-2 mt-4">
                Hospital Address
              </label>
              <input
                type="text"
                name="hospitalAddress"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                value={formData.hospitalAddress}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          <div className="flex justify-between mt-6">
            <button
              type="button"
              className="px-6 py-3 bg-red-500 text-white rounded-lg"
              onClick={handleNextStep}
            >
              {step === 5 && userType === "hospital" ? "Submit" : "Next"}
            </button>
          </div>
        </form>
      </div>
    </div>
    <Footer />
  </>
);
};

export default SignUpPage;
