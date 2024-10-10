import React, { useState } from "react";
import "./DoctorSideBar.css";
import { IconButton } from "@mui/material";
import { sideBarData } from "./DoctorData";
import { auth } from "../../firebaseConfig";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";

const DoctorSideBar = ({ onSelect }) => {
  const [selected, setSelected] = useState(0);
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
    setSelected(index);
    onSelect(heading);
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
              onClick={() => handleMenuClick(index, item.heading)}
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

export default DoctorSideBar;
