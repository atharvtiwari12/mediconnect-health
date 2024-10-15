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
    // Fetch doctor details and appointment based on appointmentId
    const fetchDetails = async () => {
      const appointmentRef = doc(db, "appointments", appointmentId);
      const appointmentSnap = await getDoc(appointmentRef);
      if (appointmentSnap.exists()) {
        const appointmentData = appointmentSnap.data();
        setAppointment(appointmentData); // Store appointment data
        setDoctor(appointmentData); // Assuming appointment contains doctor info
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
      };

      // Check if currentUser is a doctor or patient
      if (currentUser.uid === doctor.doctorId) {
        // Doctor is sending the message
        messageData.senderId = doctor.doctorId; // Set senderId to doctor's ID
        messageData.receiverId = appointment.patientId; // Set receiverId to patient's ID
      } else {
        // Patient is sending the message
        messageData.senderId = currentUser.uid; // Set senderId to patient's ID
        messageData.receiverId = doctor.doctorId; // Set receiverId to doctor's ID
      }

      await addDoc(
        collection(db, "chats", appointmentId, "messages"),
        messageData
      );
      setNewMessage(""); // Clear the input after sending
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar and Chat UI Here */}
      <div className="flex-1 p-4 flex flex-col">
        {/* Messages and Input Form */}
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
