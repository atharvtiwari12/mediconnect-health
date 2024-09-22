import React, { useState } from "react";
import "./SideBar.css";
import { IconButton } from "@mui/material";
import { sideBarData } from "./Data";
import LogoutIcon from "@mui/icons-material/Logout";

const SideBar = () => {
  const [selected, setSelected] = useState(0);
  const [color, setColor] = useState("black"); // Initial color

  const handleClick = () => {
    // Toggle between colors on click
    setColor((prevColor) => (prevColor === "black" ? "blue" : "black"));
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
              onClick={() => setSelected(index)}
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
        <LogoutIcon className="exit" />
      </div>
    </div>
  );
};

export default SideBar;
