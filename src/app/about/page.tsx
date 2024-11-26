"use client";
import React, { useEffect } from "react";
import "./about.css";
import AOS from "aos";
import "aos/dist/aos.css";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";

const AboutPage = () => {
  useEffect(() => {
    AOS.init({
      duration: 500, // Animation duration
      once: true, // Whether animation should happen only once
    });
  }, []);

  return (
    <>
      <Navbar />
      <section className="aboutPage">
        <div className="overlay"></div>
        <div className="aboutContent">
          {/* Title Section */}
          <header className="aboutHeader" data-aos="fade-down">
            <h1 className="title">
              Revolutionizing{" "}
              <span className="highlight">Hospital Management</span>
            </h1>
            <p className="tagline">Seamless. Efficient. Intelligent.</p>
          </header>

          {/* Description Section */}
          <div className="description" data-aos="fade-up">
            <p>
              At <span className="highlight">Hospital Room Management</span>, we
              are dedicated to transforming healthcare operations through
              innovative AI-driven solutions. Our platform automates room
              bookings, optimizes patient assignments, and provides real-time
              notifications to ensure optimal resource utilization and enhanced
              patient care.
            </p>
          </div>

          {/* Features Section */}
          <div className="featuresList">
            <div className="feature" data-aos="fade-up">
              <h3>AI-Driven Room Assignments</h3>
              <p>
                Automatically allocate rooms based on patient criticality and
                resource availability, ensuring efficient and effective care
                delivery.
              </p>
            </div>
            <div className="feature" data-aos="fade-up" data-aos-delay="100">
              <h3>Real-Time Notifications</h3>
              <p>
                Stay informed with instant alerts for room availability, patient
                admissions, and emergency situations, enabling swift
                decision-making.
              </p>
            </div>
            <div className="feature" data-aos="fade-up" data-aos-delay="200">
              <h3>Comprehensive Dashboard</h3>
              <p>
                Monitor all activities and metrics in one intuitive interface,
                providing insights and enhancing operational efficiency.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="cta" data-aos="fade-up" data-aos-delay="300">
            <button className="learnMoreBtn">Learn More ➜</button>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default AboutPage;
