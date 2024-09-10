import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./components/MainPage/MainPage";
import RegisterDoctor from "./components/RegisterDoctor/RegisterDoctor";
import RegisterPatient from "./components/RegisterPatient/RegisterPatient";
import Login from "./components/Login/Login";
import DoctorDashboard from "./components/DoctorDashboard/DoctorDashboard";
import PatientDashboard from "./components/PatientDashboard/PatientDashboard";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/register-doctor" element={<RegisterDoctor />} />
        <Route path="/register-patient" element={<RegisterPatient />} />
        <Route path="/login" element={<Login />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/patient-dashboard" element={<PatientDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
