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

const ChatHeader = ({ receiverName }) => {
  return (
    <div className="bg-gray-200 p-4 text-lg font-bold">
      {receiverName ? receiverName : "Chat"}
    </div>
  );
};

const ChatPage = () => {
  const { currentUser } = useAuth();
  const { appointmentId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [doctor, setDoctor] = useState(null); // To hold doctor details
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
        const doctorRef = doc(db, "doctors", appointmentData.doctorId);
        const doctorSnap = await getDoc(doctorRef);
        if (doctorSnap.exists()) {
          setDoctor(doctorSnap.data()); // Store doctor data
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
      if (currentUser.uid === appointment.doctorId) {
        // If the current user is the doctor
        messageData.receiverId = appointment.patientId; // Patient is the receiver
      } else {
        // If the current user is the patient
        messageData.receiverId = appointment.doctorId; // Doctor is the receiver
      }

      // Log the IDs for debugging
      console.log("Sending Message:");
      console.log("Sender ID:", messageData.senderId);
      console.log("Receiver ID:", messageData.receiverId);

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
    <div className="flex h-screen">
      <div className="flex-1 p-4 flex flex-col">
        <ChatHeader receiverName={receiverName} />
        <div className="h-full bg-white shadow-lg rounded-lg flex flex-col">
          <div className="h-64 overflow-y-scroll mb-4 flex-1">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-2 my-2 rounded-lg ${
                  msg.senderId === currentUser.uid
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <form onSubmit={handleSendMessage} className="flex p-2 border-t">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow p-2 border rounded-lg"
            />
            <button
              type="submit"
              className="ml-2 p-2 bg-blue-500 text-white rounded-lg"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
