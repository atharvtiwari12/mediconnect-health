import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DoctorUserStates.css";
import download from "../../assets/download.jpeg";
import { auth, db } from "../../firebaseConfig";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

const DoctorUserStates = () => {
  const [loading, setLoading] = useState(true);
  const [doctorData, setDoctorData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctorData = async () => {
      const user = auth.currentUser;

      if (!user) {
        navigate("/login");
        return;
      }

      try {
        const docRef = doc(db, "doctors", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setDoctorData(docSnap.data());
          await fetchAppointments(docSnap.id);
        } else {
          setError("No doctor data found!");
        }
      } catch (error) {
        setError("Error fetching doctor data.");
        console.error("Error fetching doctor data: ", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchAppointments = async (doctorId) => {
      try {
        const appointmentsRef = collection(db, "appointments");
        const q = query(appointmentsRef, where("doctorId", "==", doctorId));
        const querySnapshot = await getDocs(q);
        const appointmentsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Update state with all appointments
        setAppointments(appointmentsList);
      } catch (error) {
        console.error("Error fetching appointments: ", error);
      }
    };

    fetchDoctorData();
  }, [navigate]);

  const updateAppointmentStatus = async (appointmentId, status) => {
    try {
      const appointmentRef = doc(db, "appointments", appointmentId);
      await updateDoc(appointmentRef, { status: status });
      // Optionally, you can also update the state locally after successful update
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.id === appointmentId
            ? { ...appointment, status: status }
            : appointment
        )
      );
    } catch (error) {
      console.error("Error updating appointment status: ", error);
    }
  };

  const handleAcceptAppointment = (appointmentId) => {
    updateAppointmentStatus(appointmentId, "accepted");
  };

  const handleRejectAppointment = (appointmentId) => {
    updateAppointmentStatus(appointmentId, "rejected");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!doctorData) {
    return <div>No doctor data available.</div>;
  }

  return (
    <div className="userstate">
      <div className="Profile-sec" onClick={() => navigate("/doctor-profile")}>
        <img src={doctorData.profilePicture || download} alt="Profile" />
        <h3>{doctorData.name}</h3>
        <div className="testi">
          <p>{doctorData.specialization}</p>
        </div>
      </div>
      <div className="user-cred">
        <div className="block">
          <p className="main">Experience</p>
          <p className="second">{`${doctorData.experience} years`}</p>
        </div>
        <div className="block">
          <p className="main">Qualification</p>
          <p className="second">{doctorData.qualifications}</p>
        </div>
      </div>

      <div className="appointments">
        <h4>Pending Appointments</h4>
        {appointments.filter((appointment) => appointment.status === "pending")
          .length > 0 ? (
          appointments
            .filter((appointment) => appointment.status === "pending")
            .map((appointment) => (
              <div key={appointment.id} className="appointment">
                <p>
                  <strong>Patient:</strong> {appointment.patientName}
                </p>
                <p>
                  <strong>Date:</strong> {appointment.date}
                </p>
                <p>
                  <strong>Time:</strong> {appointment.time}
                </p>
                <p>
                  <strong>Status:</strong> {appointment.status}
                </p>
                <div className="appointment-actions">
                  <CheckIcon
                    onClick={() => handleAcceptAppointment(appointment.id)}
                    style={{ cursor: "pointer", color: "green" }}
                  />
                  <CloseIcon
                    onClick={() => handleRejectAppointment(appointment.id)}
                    style={{ cursor: "pointer", color: "red" }}
                  />
                </div>
              </div>
            ))
        ) : (
          <p>No pending appointments found.</p>
        )}

        <h4>Rejected Appointments</h4>
        {appointments.filter((appointment) => appointment.status === "rejected")
          .length > 0 ? (
          appointments
            .filter((appointment) => appointment.status === "rejected")
            .map((appointment) => (
              <div key={appointment.id} className="appointment">
                <p>
                  <strong>Patient:</strong> {appointment.patientName}
                </p>
                <p>
                  <strong>Date:</strong> {appointment.date}
                </p>
                <p>
                  <strong>Time:</strong> {appointment.time}
                </p>
                <p>
                  <strong>Status:</strong> {appointment.status}
                </p>
              </div>
            ))
        ) : (
          <p>No rejected appointments found.</p>
        )}
      </div>
    </div>
  );
};

export default DoctorUserStates;
