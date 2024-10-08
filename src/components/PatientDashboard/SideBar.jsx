import React, { useState } from "react";
import "./SideBar.css";
import { IconButton } from "@mui/material";
import { sideBarData } from "./Data";
import { auth } from "../../firebaseConfig";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";

const SideBar = ({ onSelect }) => {
  const [selected, setSelected] = useState(0); // To track the selected index
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleMenuClick = (index, heading) => {
    setSelected(index); // Update selected index
    onSelect(heading); // Pass selected heading back to PatientDashboard
  };

  return (
    <div className="sidebar">
      <p>MediConnect</p>
      <div className="menu">
        {sideBarData.map((item, index) => {
          return (
            <div
              className={selected === index ? "menuItem active" : "menuItem"}
              key={index}
              onClick={() => handleMenuClick(index, item.heading)} // Handle menu click
            >
              <IconButton>
                <item.icon className="icons" style={{ color: "#6e7191" }} />
              </IconButton>
              <span>{item.heading}</span>
            </div>
          );
        })}
      </div>
      <div>
        <IconButton disableRipple onClick={handleLogout}>
          <LogoutIcon className="exit" />
        </IconButton>
      </div>
    </div>
  );
};

export default SideBar;
