import React from "react";
import "./features.css";

const FeaturesSection = () => {
  return (
    <div className="featuresSection">
      <h2 className="featuresHeading text-gray-300 text-3xl md:text-4xl lg:text-5xl font-bold text-center">
        Features That <span className="highlight text-red-500">Transform</span>{" "}
        Healthcare
      </h2>
      <p className="featuresSubHeading text-gray-400 text-sm md:text-base lg:text-lg max-w-3xl mx-auto mt-4">
        Explore the cutting-edge capabilities of our AI-powered hospital room
        management system. From automated patient handling to real-time
        notifications, we've got you covered.
      </p>

      <div className="featuresCardsContainer flex flex-wrap justify-center gap-6 mt-10">
        {/* Feature 1 */}

        {/* Feature 2 */}
        <div className="featureCard">
          <div className="iconContainer">
            <img
              src="https://cdn-icons-png.flaticon.com/128/2014/2014825.png"
              alt="Notifications Icon"
              className="featureIcon"
            />
          </div>
          <h3 className="featureTitle text-gray-200">Real-Time Alerts</h3>
          <p className="featureDescription text-gray-400">
            Stay updated with real-time notifications about room availability,
            patient conditions, and emergencies.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="featureCard">
          <div className="iconContainer">
            <img
              src="https://cdn-icons-png.flaticon.com/128/3974/3974807.png"
              alt="Automation Icon"
              className="featureIcon"
            />
          </div>
          <h3 className="featureTitle text-gray-200">
            Automated Room Management
          </h3>
          <p className="featureDescription text-gray-400">
            Automate room booking, assignment, and tracking to save time and
            eliminate manual errors.
          </p>
        </div>

        {/* Feature 4 */}
        <div className="featureCard">
          <div className="iconContainer">
            <img
              src="https://cdn-icons-png.flaticon.com/128/2318/2318736.png"
              alt="Reports Icon"
              className="featureIcon"
            />
          </div>
          <h3 className="featureTitle text-gray-200">In-Depth Analytics</h3>
          <p className="featureDescription text-gray-400">
            Analyze trends and data to enhance decision-making and improve
            operational efficiency.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
