import React from "react";
import "./PatientDashboard.css";
import SideBar from "./Sidebar";
import FeedSec from "./FeedSec";
import UserStates from "./UserStates";

const PatientDashboard = () => {
  return (
    <>
      <div className="home">
        <div className="sidebar">
          <SideBar />
        </div>
        <div className="feed">
          <FeedSec />
        </div>
        <div className="userstates">
          <UserStates />
        </div>
      </div>
    </>
  );
};

export default PatientDashboard;
