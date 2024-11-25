import React from "react";
import "./middlepart.css";

type Props = {};

const MiddlePart = (props: Props) => {
  return (
    <div className="middlePart">
      <h2 className="headlineText">
        Hospital Room Management <span className="highlight">Made Easy</span>{" "}
        with AI
      </h2>
      <p className="subHeading">
        Harness the power of artificial intelligence to streamline patient
        analysis, room bookings, management, and logs. Elevate healthcare
        efficiency with cutting-edge technology.
      </p>
      <center>
        <input
          type="button"
          className="getStartedBtn"
          value="Get started now ->"
        />
      </center>
    </div>
  );
};

export default MiddlePart;
