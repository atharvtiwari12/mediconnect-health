import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../../firebaseConfig"; // Adjust import if needed
import { collection, query, where, getDocs } from "firebase/firestore";
import MicNoneIcon from "@mui/icons-material/MicNone";
import "./DoctorAppoint.css"; // Assuming you have CSS for styles

const DoctorAppoint = () => {
  const navigate = useNavigate();
  const [acceptedAppointments, setAcceptedAppointments] = useState([]);

  useEffect(() => {
    const fetchAcceptedAppointments = async () => {
      const user = auth.currentUser;
      if (!user) return; // Handle if user is not logged in

      try {
        const appointmentsRef = collection(db, "appointments");
        const q = query(
          appointmentsRef,
          where("doctorId", "==", user.uid),
          where("status", "==", "accepted")
        );
        const querySnapshot = await getDocs(q);

        const appointmentsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAcceptedAppointments(appointmentsList);
      } catch (error) {
        console.error("Error fetching accepted appointments: ", error);
      }
    };

    fetchAcceptedAppointments();
  }, []);

  const handleChatClick = (appointmentId, patientName) => {
    navigate(`/chat/${appointmentId}`); // Navigate to the chat page with appointmentId
    // Set patient name for sidebar display
    localStorage.setItem("currentPatientName", patientName);
  };

  return (
    <div className="appointments-container">
      <h2>Accepted Appointments</h2>
      {acceptedAppointments.length > 0 ? (
        acceptedAppointments.map((appointment) => (
          <div
            key={appointment.id}
            className="appointment-card"
            onClick={() =>
              handleChatClick(appointment.id, appointment.patientName)
            } // Pass patientName to handleChatClick
          >
            <h3>{appointment.patientName}</h3>
            <p>Date: {appointment.date}</p>
            <p>Time: {appointment.time}</p>
            <span>
              <MicNoneIcon color="primary" style={{ cursor: "pointer" }} />{" "}
              {/* Chat Icon */}
            </span>
          </div>
        ))
      ) : (
        <p>No accepted appointments found.</p>
      )}
    </div>
  );
};

export default DoctorAppoint;
