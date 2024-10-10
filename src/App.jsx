// src/App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import MainPage from "./components/MainPage/MainPage";
import RegisterDoctor from "./components/RegisterDoctor/RegisterDoctor";
import RegisterPatient from "./components/RegisterPatient/RegisterPatient";
import Login from "./components/Login/Login";
import DoctorDashboard from "./components/DoctorDashboard/DoctorDashboard";
import PatientDashboard from "./components/PatientDashboard/PatientDashboard";
import VerifyEmail from "./components/VerifyEmail/VerifyEmail";
import PatientProfile from "./components/PatientProfile/PatientProfile";
import { useAuth } from "./firebaseConfig";
import DoctorProfile from "./components/DoctorProfile/DoctorProfile";

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/" />;
  }

  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/register-doctor" element={<RegisterDoctor />} />
        <Route path="/register-patient" element={<RegisterPatient />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/doctor-dashboard"
          element={
            <ProtectedRoute>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient-dashboard"
          element={
            <ProtectedRoute>
              <PatientDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/verify-email"
          element={
            <ProtectedRoute>
              <VerifyEmail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <PatientProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor-profile"
          element={
            <ProtectedRoute>
              <DoctorProfile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
