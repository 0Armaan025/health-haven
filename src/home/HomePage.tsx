import React from "react";
import "./homepage.css";
import Navbar from "@/components/navbar/Navbar";
import MiddlePart from "./middle/MiddlePart";

const HomePage = () => {
  return (
    <>
      <div className="homePage flex flex-col justify-start items-start">
        <Navbar />
        {/* man this takes a ton of time, at school rn :) */}
        {/* now at home, this is so much faster and easier here dude :) */}
        <MiddlePart />
      </div>
    </>
  );
};

export default HomePage;
