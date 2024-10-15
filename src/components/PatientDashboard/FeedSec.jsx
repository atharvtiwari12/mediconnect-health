import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import MicNoneIcon from "@mui/icons-material/MicNone";
import ChatIcon from "@mui/icons-material/Chat";
import { useAuth } from "../../firebaseConfig";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { Button } from "@mui/material";

const FeedSec = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  const [userName, setUserName] = useState("User");
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        const userDocRef = doc(db, "patients", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setUserName(userData.name || "User");
        }

        const appointmentsRef = collection(db, "appointments");
        const querySnapshot = await getDocs(appointmentsRef);
        const userAppointments = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter(
            (appointment) =>
              appointment.patientId === currentUser.uid &&
              appointment.status === "accepted"
          );

        setAppointments(userAppointments);
      }
    };

    fetchUserData();
  }, [currentUser]);

  return (
    <div className="h-screen p-6 bg-aliceblue w-full flex flex-col justify-start">
      {/* Header Section */}
      <div className="flex justify-between items-center w-full max-w-5xl mx-auto">
        <h6 className="text-gray-500">Pages {location.pathname}</h6>
        <div className="flex items-center border border-gray-300 rounded-lg w-full max-w-md bg-white">
          <SearchIcon fontSize="small" className="text-gray-400 p-2" />
          <input
            className="px-4 py-2 outline-none w-full"
            type="search"
            placeholder="Search any keywords"
          />
          <MicNoneIcon fontSize="small" className="text-gray-400 p-2" />
        </div>
      </div>

      {/* Greeting Section */}
      <div className="w-full max-w-5xl mx-auto bg-gradient-to-r from-blue-500 to-teal-400 text-white p-6 rounded-lg mt-6 mb-6">
        <h3 className="text-2xl font-bold">
          Hello <span className="font-bold">{userName}</span>,
        </h3>
        <p className="mt-2 text-lg">
          Have a nice day and don't forget to take{" "}
          <span className="font-semibold">care of your health!</span>
        </p>
        <Button sx={{ color: "white" }} className="mt-4">
          Learn more {">"}
        </Button>
      </div>

      {/* Chat Options */}
      <div className="w-full max-w-5xl mx-auto mt-6 mb-8">
        <h4 className="text-gray-800 font-semibold mb-4">My Appointments</h4>
        {appointments.length > 0 ? (
          appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex justify-between items-center bg-white p-4 mb-4 shadow-md rounded-lg"
            >
              <div>
                <h5 className="text-gray-800 font-bold">
                  {appointment.doctorName}
                </h5>
                <p className="text-gray-600">
                  {appointment.date} {appointment.time}
                </p>
              </div>
              <Link to={`/chat/${appointment.id}`}>
                <ChatIcon className="text-blue-500 cursor-pointer hover:text-blue-700" />
              </Link>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No accepted appointments found.</p>
        )}
      </div>
    </div>
  );
};

export default FeedSec;
