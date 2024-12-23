import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import MicNoneIcon from "@mui/icons-material/MicNone";
import { Button } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { db, auth } from "../../firebaseConfig"; // Adjust import if needed
import { collection, query, where, getDocs } from "firebase/firestore";
import { FaComment } from "react-icons/fa"; // Importing the chat icon from react-icons
import "./DoctorDash.css";
import download from "../../assets/download.jpeg";

const DoctorDash = () => {
  const location = useLocation();
  const [acceptedAppointments, setAcceptedAppointments] = useState([]);

  useEffect(() => {
    const fetchAcceptedAppointments = async () => {
      const user = auth.currentUser;
      if (!user) return; // Handle if user is not logged in

      try {
        const appointmentsRef = collection(db, "appointments");
        const q = query(
          appointmentsRef,
          where("doctorId", "==", user.uid),
          where("status", "==", "accepted")
        );
        const querySnapshot = await getDocs(q);

        const appointmentsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAcceptedAppointments(appointmentsList);
      } catch (error) {
        console.error("Error fetching accepted appointments: ", error);
      }
    };

    fetchAcceptedAppointments();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="feed-head">
        <h6>Pages {location.pathname}</h6>
        <div className="search">
          <SearchIcon fontSize="small" color="disabled" />
          <input
            className="input"
            type="search"
            placeholder="Search any keywords"
          />
          <MicNoneIcon fontSize="small" color="disabled" className="vc" />
        </div>
      </div>

      <div className="profile-overview">
        <div className="overview-card">
          <h4>Total Patients</h4>
          <p>120</p>
        </div>
        <div className="overview-card">
          <h4>Upcoming Appointments</h4>
          <p>{acceptedAppointments.length}</p>
        </div>
        <div className="overview-card">
          <h4>Specialization</h4>
          <p>Dermatology</p>
        </div>
      </div>

      {/* Accepted Appointments */}
      <div className="recent-appointments">
        <div className="cal-top">
          <p>Accepted Appointments</p>
          <Button
            variant="contained"
            startIcon={<CalendarMonthIcon />}
            sx={{
              backgroundColor: "#1a4fba",
              color: "white",
              fontSize: "15px",
              padding: "5px 7px",
            }}
          >
            November
          </Button>
        </div>
        <div className="appointment-list">
          {acceptedAppointments.length > 0 ? (
            acceptedAppointments.map((appointment) => (
              <div key={appointment.id} className="appointment-card">
                <div className="appointment-details">
                  <div className="patient-info">
                    <img
                      src={appointment.patientPhoto || download} // Placeholder if no photo
                      alt={`${appointment.patientName}'s profile`}
                      className="patient-photo"
                    />
                    <h3 className="patient-name">{appointment.patientName}</h3>
                  </div>
                  <div className="appointment-info">
                    <div className="appointment-date-time">
                      <p className="appointment-label">Date:</p>
                      <p className="appointment-date">{appointment.date}</p>
                      <p className="appointment-label">Time:</p>
                      <p className="appointment-time">{appointment.time}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No accepted appointments found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDash;
