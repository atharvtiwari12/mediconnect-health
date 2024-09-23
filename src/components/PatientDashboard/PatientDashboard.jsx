import React, { useEffect, useState } from "react";
import { auth } from "../../firebaseConfig";
import { useNavigate } from "react-router-dom";
import "./PatientDashboard.css";
import SideBar from "./SideBar";
import FeedSec from "./FeedSec";
import UserStates from "./UserStates";

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const checkVerification = async () => {
      const user = auth.currentUser;

      if (user) {
        await user.reload();
        if (user.emailVerified) {
          setIsVerified(true);
        } else {
          navigate("/verify-email");
        }
      } else {
        navigate("/login");
      }
    };

    checkVerification();
  }, [navigate]);

  if (!isVerified) {
    return <div>Loading...</div>;
  }

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
