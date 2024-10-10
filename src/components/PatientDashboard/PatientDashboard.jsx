import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebaseConfig";
import SideBar from "./SideBar";
import FeedSec from "./FeedSec";
import PatAppoint from "./PatAppoint";
import Records from "./Records";
import Settings from "./Settings";
import UserStates from "./UserStates";

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Dashboard");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patientData, setPatientData] = useState(null); // New state for patient data

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

  const handleSidebarSelection = (option) => {
    setSelectedOption(option);
  };

  return (
    <div className="home">
      <div className="sidebar">
        <SideBar onSelect={handleSidebarSelection} />
      </div>
      <div className="feed">
        {selectedOption === "Dashboard" && <FeedSec />}
        {selectedOption === "Appointment" && (
          <PatAppoint
            setIsModalOpen={setIsModalOpen}
            patientData={patientData} // Pass patient data to PatAppoint
          />
        )}
        {selectedOption === "Record" && <Records />}
        {selectedOption === "Settings" && <Settings />}
      </div>
      <div className="userstates">
        <UserStates
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          setPatientData={setPatientData} // Pass setter function for patient data
        />
      </div>
    </div>
  );
};

export default PatientDashboard;
