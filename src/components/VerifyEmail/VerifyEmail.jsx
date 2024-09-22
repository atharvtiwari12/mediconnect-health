import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";

const VerifyEmail = () => {
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();

  const checkEmailVerification = async () => {
    try {
      const user = auth.currentUser;

      if (user) {
        // Reload user to get the latest email verification status
        await user.reload();

        // If email is verified, proceed to fetch the role from Firestore
        if (user.emailVerified) {
          setIsVerified(true);

          // Try to fetch the user data from the 'patients' collection
          const patientDocRef = doc(db, "patients", user.uid);
          const patientDocSnap = await getDoc(patientDocRef);

          if (patientDocSnap.exists()) {
            const userData = patientDocSnap.data();
            const userRole = userData.role;

            if (userRole === "patient") {
              navigate("/patient-dashboard");
            }
          } else {
            // If not found in 'patients', check 'doctors'
            const doctorDocRef = doc(db, "doctors", user.uid);
            const doctorDocSnap = await getDoc(doctorDocRef);

            if (doctorDocSnap.exists()) {
              const userData = doctorDocSnap.data();
              const userRole = userData.role;

              if (userRole === "doctor") {
                navigate("/doctor-dashboard");
              }
            } else {
              console.error("No user data found in patients or doctors!");
            }
          }
        }
      }
    } catch (error) {
      console.error("Error checking email verification:", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(checkEmailVerification, 5000);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="verify-email">
      <h2>Please verify your email</h2>
      <p>
        A verification link has been sent to your email address. Please check
        your inbox and click the verification link.
      </p>
      {!isVerified && (
        <p style={{ color: "red" }}>Waiting for email to be verified...</p>
      )}
      {isVerified && (
        <p style={{ color: "green" }}>Email verified! Redirecting...</p>
      )}
    </div>
  );
};

export default VerifyEmail;
