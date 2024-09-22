import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebaseConfig";

const DoctorDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;

    const checkEmailVerification = async () => {
      if (user) {
        await user.reload(); // Refresh the user's authentication token
        if (!user.emailVerified) {
          navigate("/verify-email");
        }
      }
    };

    checkEmailVerification();
  }, [navigate]);

  return (
    <div>
      <h2>Welcome to your Doctor Dashboard!</h2>
      {/* Dashboard content */}
    </div>
  );
};

export default DoctorDashboard;
