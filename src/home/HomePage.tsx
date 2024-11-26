import React from "react";
import "./homepage.css";
import Navbar from "@/components/navbar/Navbar";
import MiddlePart from "./middle/MiddlePart";
import FeaturesSection from "./features/FeaturesSection";
import Footer from "@/components/footer/Footer";

const HomePage = () => {
  return (
    <>
      <div className="homePage flex flex-col justify-start items-start">
        <Navbar />
        {/* man this takes a ton of time, at school rn :) */}
        {/* now at home, this is so much faster and easier here dude :) */}
        <MiddlePart />
        <FeaturesSection />
      </div>
      <Footer />
    </>
  );
};

export default HomePage;
