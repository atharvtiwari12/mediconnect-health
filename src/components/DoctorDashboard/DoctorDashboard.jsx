import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebaseConfig";
import DoctorSideBar from "./DoctorSideBar";
import DoctorUserStates from "./DoctorUserStates";
import DoctorDash from "./DoctorDash";
import DoctorAppoint from "./DoctorAppoint";
import DoctorRecords from "./DoctorRecords"; // Assuming these components exist
import DoctorSettings from "./DoctorSettings"; // Assuming these components exist
import "./DoctorDashboard.css";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState("Dashboard"); // Ensuring initial state matches options

  useEffect(() => {
    const user = auth.currentUser;

    const checkEmailVerification = async () => {
      if (user) {
        await user.reload();
        if (!user.emailVerified) {
          navigate("/verify-email");
        }
      } else {
        navigate("/login"); // Redirect if no user is logged in
      }
    };

    checkEmailVerification();
  }, [navigate]);

  const handleSidebarSelection = (option) => {
    setSelectedOption(option);
  };

  return (
    <div className="home">
      <div className="sidebar">
        <DoctorSideBar onSelect={handleSidebarSelection} />
      </div>
      <div className="feed">
        {selectedOption === "Dashboard" && <DoctorDash />}
        {selectedOption === "Appointment" && <DoctorAppoint />}
        {selectedOption === "Record" && <DoctorRecords />}
        {selectedOption === "Settings" && <DoctorSettings />}
      </div>
      <div className="userstates">
        <DoctorUserStates />
      </div>
    </div>
  );
};

export default DoctorDashboard;
