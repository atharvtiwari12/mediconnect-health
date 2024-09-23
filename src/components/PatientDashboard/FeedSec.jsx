import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import MicNoneIcon from "@mui/icons-material/MicNone";
import { useAuth } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import "./FeedSec.css";
import { Button } from "@mui/material";
import GridContainer from "./RanDom";

const FeedSec = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        const userDocRef = doc(db, "patients", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setUserName(userData.name || "User");
        }
      }
    };

    fetchUserData();
  }, [currentUser]);

  return (
    <div className="feed-sec">
      <div className="feed-head">
        <h6>Pages {location.pathname}</h6>
        <div className="search">
          <SearchIcon fontSize="small" color="disabled" />
          <input
            className="input"
            type="search"
            placeholder="search any keywords"
          />
          <MicNoneIcon fontSize="small" color="disabled" className="vc" />
        </div>
      </div>
      <div className="feed-mid">
        <p className="dash">Dashboard overview</p>
        <div className="prfl-card">
          <h3>
            Hello <span className="name">{userName}</span>,
          </h3>
          <p className="note">
            Have a nice day and don't forget to take{" "}
            <span>care of your health!</span>
          </p>
          <Button sx={{ color: "lime", fontSize: "8px" }}>
            Learn more {">"}
          </Button>
        </div>
      </div>
      <div className="random-feed">
        <GridContainer />
      </div>
    </div>
  );
};

export default FeedSec;
