import React from "react";
import { useNavigate } from "react-router-dom";
import "./MainPage.css";

const MainPage = () => {
  const navigate = useNavigate();

  const handleDoctorRegister = () => {
    navigate("/register-doctor");
  };

  const handlePatientRegister = () => {
    navigate("/register-patient");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="main-page">
      <h2>Welcome to the Healthcare Management System</h2>
      <button onClick={handleDoctorRegister}>Register as Doctor</button>
      <button onClick={handlePatientRegister}>Register as Patient</button>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default MainPage;
