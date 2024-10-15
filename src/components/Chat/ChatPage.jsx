import React, { useEffect, useState } from "react";
import { useAuth } from "../../firebaseConfig"; // Import your Auth context
import { db } from "../../firebaseConfig"; // Import your Firestore config
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";
import { useParams } from "react-router-dom";
import ChatHeader from "./ChatHeader"; // Import the ChatHeader

const ChatPage = () => {
  const { currentUser } = useAuth();
  const { appointmentId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [doctor, setDoctor] = useState(null); // To hold doctor details
  const [patient, setPatient] = useState(null); // To hold patient details
  const [appointment, setAppointment] = useState(null); // To hold appointment details

  useEffect(() => {
    const messagesRef = collection(db, "chats", appointmentId, "messages");
    const q = query(messagesRef, orderBy("timestamp"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, [appointmentId]);

  useEffect(() => {
    const fetchDetails = async () => {
      const appointmentRef = doc(db, "appointments", appointmentId);
      const appointmentSnap = await getDoc(appointmentRef);
      if (appointmentSnap.exists()) {
        const appointmentData = appointmentSnap.data();
        setAppointment(appointmentData); // Store appointment data

        // Fetch Doctor Details
        const doctorRef = doc(db, "doctors", appointmentData.doctorId);
        const doctorSnap = await getDoc(doctorRef);
        if (doctorSnap.exists()) {
          setDoctor(doctorSnap.data()); // Store doctor data
        }

        // Fetch Patient Details
        const patientRef = doc(db, "patients", appointmentData.patientId);
        const patientSnap = await getDoc(patientRef);
        if (patientSnap.exists()) {
          setPatient(patientSnap.data()); // Store patient data
        }
      }
    };

    fetchDetails();
  }, [appointmentId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() && appointment) {
      const messageData = {
        text: newMessage,
        timestamp: new Date(),
        senderId: currentUser.uid, // Always set senderId to currentUser
      };

      // Set receiverId based on the logged-in user and appointment data
      messageData.receiverId =
        currentUser.uid === appointment.doctorId
          ? appointment.patientId
          : appointment.doctorId;

      await addDoc(
        collection(db, "chats", appointmentId, "messages"),
        messageData
      );
      setNewMessage(""); // Clear the input after sending
    }
  };

  // Determine receiver's name based on the appointment
  const receiverName =
    currentUser.uid === appointment?.doctorId
      ? appointment.patientName
      : appointment?.doctorName;

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-lg p-4">
        <h2 className="text-lg font-bold mb-4">Profile</h2>
        {currentUser.uid === appointment?.doctorId ? (
          <div>
            <h3 className="font-semibold">{patient?.name}</h3>
            <p>{patient?.details}</p>
          </div>
        ) : (
          <div>
            <h3 className="font-semibold">{doctor?.name}</h3>
            <p>{doctor?.specialty}</p>
          </div>
        )}
      </aside>
      <div className="flex-1 flex flex-col">
        <ChatHeader receiverName={receiverName} />
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.senderId === currentUser.uid ? "items-end" : "items-start"
              }`}
            >
              {/* Sender Name */}
              <div className="text-xs text-gray-500">
                {msg.senderId === currentUser.uid ? "Me" : receiverName}
              </div>
              {/* Message Bubble */}
              <div
                className={`p-3 rounded-lg shadow mb-1 ${
                  msg.senderId === currentUser.uid
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                } max-w-xs`}
              >
                {msg.text}
              </div>
              {/* Timestamp */}
              <div className="text-xs text-gray-500">
                {new Date(msg.timestamp?.toDate()).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          ))}
        </div>
        <form
          onSubmit={handleSendMessage}
          className="flex p-2 border-t border-gray-300 bg-white"
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="p-3 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
