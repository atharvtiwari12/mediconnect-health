import React from "react";
import { useLocation } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import MicNoneIcon from "@mui/icons-material/MicNone";
import { Button } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import "./DoctorDash.css";

const DoctorDash = () => {
  const location = useLocation();

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
          <p>5</p>
        </div>
        <div className="overview-card">
          <h4>Specialization</h4>
          <p>Dermatology</p>
        </div>
      </div>

      {/* Recent Appointments */}
      <div className="recent-appointments">
        <div className="cal-top">
          <p>Recent Appointments</p>
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
            September
          </Button>
        </div>
        <div className="appointment-list">
          {["John Doe", "Jane Smith", "Michael Lee"].map((name, index) => (
            <div key={index} className="appointment-card">
              <h3>{name}</h3>
              <p>Date: 12 Sept, 2024</p>
              <p>Time: 10:00 AM</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorDash;
