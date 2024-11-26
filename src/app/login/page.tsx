"use client";
import React, { useState, useEffect } from "react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AOS from "aos";
import "./login.css";
import "aos/dist/aos.css";

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogin = () => {
    // Validate email and password fields
    if (formData.email.trim() === "") {
      alert("Email is required!");
      return;
    }

    if (formData.password.trim() === "") {
      alert("Password is required!");
      return;
    }

    // Proceed with login logic (API call or further action)
    alert("Logged in successfully!");
    // Here, you would typically send the form data to an API to authenticate the user
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
      <div className="logInPage relative min-h-screen flex items-center justify-center bg-dark-gray">
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
            Login
          </h2>
          <p
            className="text-center text-gray-200 mb-6"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Please enter your credentials to log in.
          </p>

          <form className="space-y-6">
            {/* Step 1: Email */}
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

            {/* Step 2: Password */}
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

            <div className="flex justify-between mt-6">
              <button
                type="button"
                className="px-6 py-3 bg-red-500 text-white rounded-lg"
                onClick={handleLogin}
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LoginPage;
