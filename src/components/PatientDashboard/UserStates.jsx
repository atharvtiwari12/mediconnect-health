import React from "react";
import "./UserStates.css";
import NotificationImportantIcon from "@mui/icons-material/NotificationImportant";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { IconButton } from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

const UserStates = () => {
  return (
    <div className="userstate">
      <NotificationImportantIcon className="bell" />
      <div className="Profile-sec">
        <img src="download.jpeg" alt="d" />
        <h3>Atharv Joshi</h3>
        <div className="testi">
          <p>20 years old</p>
          <div className="testi-side">
            <LocationOnIcon
              className="location"
              color="disabled"
              style={{ fontSize: "15px" }}
            />
            <p>Indore,India</p>
          </div>
        </div>
      </div>
      <div className="user-cred">
        <div className="block">
          <p className="main">Blood</p>
          <p className="second">B+</p>
        </div>
        <div className="block two">
          <p className="main">Height</p>
          <p className="second">176 cm</p>
        </div>
        <div className="block two">
          <p className="main">Weight</p>
          <p className="second">70kg</p>
        </div>
      </div>
      <div className="upcoming">
        <p>Upcoming</p>
        <div className="alert">
          <IconButton>
            <NotificationsActiveIcon className="noti" color="success" />
          </IconButton>
          <div className="appoint">
            <p className="txt txtt">Health appointment</p>
            <p className="txt txttt">Dr. Atharv Tiwari</p>
            <p className="txt-2">09:20AM - 11:30AM</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserStates;
