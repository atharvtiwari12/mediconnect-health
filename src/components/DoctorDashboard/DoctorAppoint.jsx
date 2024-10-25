import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../../firebaseConfig"; // Adjust import if needed
import { collection, query, where, getDocs } from "firebase/firestore";
import MicNoneIcon from "@mui/icons-material/MicNone";

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
    <div className="min-h-screen p-6 bg-aliceblue">
      <h2 className="text-2xl font-bold mb-4">Accepted Appointments</h2>
      {acceptedAppointments.length > 0 ? (
        acceptedAppointments.map((appointment) => (
          <div
            key={appointment.id}
            className="flex justify-between items-center p-4 mb-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() =>
              handleChatClick(appointment.id, appointment.patientName)
            } // Pass patientName to handleChatClick
          >
            <div className="flex flex-col">
              <h3 className="text-lg font-semibold text-gray-800">
                {appointment.patientName}
              </h3>
              <p className="text-gray-600">Date: {appointment.date}</p>
              <p className="text-gray-600">Time: {appointment.time}</p>
            </div>
            <span className="text-blue-500">
              <MicNoneIcon fontSize="large" />
            </span>
          </div>
        ))
      ) : (
        <p className="text-gray-600">No accepted appointments found.</p>
      )}
    </div>
  );
};

export default DoctorAppoint;
