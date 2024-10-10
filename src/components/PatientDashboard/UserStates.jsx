import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserStates.css";
import NotificationImportantIcon from "@mui/icons-material/NotificationImportant";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { IconButton } from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { auth, db } from "../../firebaseConfig";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import AppointmentsModal from "./BookAppointmentModal";

const UserStates = ({ isModalOpen, setIsModalOpen, setPatientData }) => {
  const [patientDataState, setPatientDataState] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatientData = async () => {
      const user = auth.currentUser;

      if (!user) {
        navigate("/login");
        return;
      }

      try {
        const docRef = doc(db, "patients", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const patientData = docSnap.data();
          setPatientDataState(patientData);
          setPatientData(patientData); // Set patient data here
        } else {
          console.error("No patient data found!");
        }

        const appointmentsRef = collection(db, "appointments");
        const q = query(appointmentsRef, where("patientId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const appointmentList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAppointments(appointmentList);
      } catch (error) {
        console.error("Error fetching patient data or appointments: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [navigate, setPatientData]); // Add setPatientData to the dependency array

  return (
    <div className="userstate">
      <NotificationImportantIcon className="bell" />
      <div className="Profile-sec" onClick={() => navigate("/profile")}>
        <img
          src={patientDataState?.profilePicture || "download.jpeg"}
          alt="Profile"
        />
        <h3>{loading ? "Loading..." : patientDataState?.name}</h3>
        <div className="testi">
          <p>{loading ? "Loading..." : `${patientDataState.age} years old`}</p>
          <div className="testi-side">
            <LocationOnIcon
              className="location"
              color="disabled"
              style={{ fontSize: "15px" }}
            />
            <p>{loading ? "Loading..." : patientDataState?.address}</p>
          </div>
        </div>
      </div>
      <div className="user-cred">
        <div className="block">
          <p className="main">Blood</p>
          <p className="second">
            {loading ? "Loading..." : patientDataState?.bloodGroup}
          </p>
        </div>
        <div className="block two">
          <p className="main">Height</p>
          <p className="second">
            {loading ? "Loading..." : `${patientDataState?.height} cm`}
          </p>
        </div>
        <div className="block two">
          <p className="main">Weight</p>
          <p className="second">
            {loading ? "Loading..." : `${patientDataState?.weight} kg`}
          </p>
        </div>
      </div>

      <div className="upcoming">
        <p>Upcoming Appointments</p>
        {appointments.length > 0 ? (
          appointments.map((appointment) => (
            <div key={appointment.id} className="alert">
              <IconButton>
                <NotificationsActiveIcon className="noti" color="success" />
              </IconButton>
              <div className="appoint">
                <p className="txt txtt">{appointment.doctorName}</p>
                <p className="txt-2">
                  {appointment.date} {appointment.time}
                </p>
                <p className="status">{`Status: ${appointment.status}`}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No upcoming appointments.</p>
        )}
      </div>

      <AppointmentsModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default UserStates;
