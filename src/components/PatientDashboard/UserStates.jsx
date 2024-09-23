import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserStates.css";
import NotificationImportantIcon from "@mui/icons-material/NotificationImportant";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { IconButton } from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { auth, db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const UserStates = () => {
  const [patientData, setPatientData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatientData = async () => {
      const user = auth.currentUser;

      if (user) {
        const docRef = doc(db, "patients", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPatientData(docSnap.data());
        } else {
          console.error("No patient data found!");
        }
      } else {
        navigate("/login");
      }
    };

    fetchPatientData();
  }, [navigate]);

  return (
    <div className="userstate">
      <NotificationImportantIcon className="bell" />
      <div className="Profile-sec" onClick={() => navigate("/profile")}>
        <img
          src={patientData?.profilePicture || "download.jpeg"}
          alt="Profile"
        />
        <h3>{patientData ? patientData.name : "Loading..."}</h3>
        <div className="testi">
          <p>{patientData ? `${patientData.age} years old` : "Loading..."}</p>
          <div className="testi-side">
            <LocationOnIcon
              className="location"
              color="disabled"
              style={{ fontSize: "15px" }}
            />
            <p>{patientData ? patientData.address : "Loading..."}</p>
          </div>
        </div>
      </div>
      <div className="user-cred">
        <div className="block">
          <p className="main">Blood</p>
          <p className="second">
            {patientData ? patientData.bloodGroup : "Loading..."}
          </p>
        </div>
        <div className="block two">
          <p className="main">Height</p>
          <p className="second">
            {patientData ? `${patientData.height} cm` : "Loading..."}
          </p>
        </div>
        <div className="block two">
          <p className="main">Weight</p>
          <p className="second">
            {patientData ? `${patientData.weight} kg` : "Loading..."}
          </p>
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
