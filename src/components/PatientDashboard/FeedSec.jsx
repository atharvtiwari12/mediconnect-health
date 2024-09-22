import React from "react";
import { useLocation } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import MicNoneIcon from "@mui/icons-material/MicNone";

import "./FeedSec.css";
import { Button } from "@mui/material";
import GridContainer from "./RanDom";
const FeedSec = () => {
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
            Hello <span className="name">ATHARV JOSHI</span>,
          </h3>
          <p className="note">
            Have a nice day and don't forget to take{" "}
            <span>care of your health!</span>
          </p>
          <Button sx={{ color: "lime", fontSize: "8px" }} si>
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
