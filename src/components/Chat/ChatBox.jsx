import React, { useEffect, useState } from "react";
import { useAuth } from "../../firebaseConfig"; // Import your Auth context
import { db } from "../../firebaseConfig"; // Import your Firestore config
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  orderBy,
} from "firebase/firestore";

const ChatBox = ({ appointment }) => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const messagesRef = collection(db, "chats", appointment.id, "messages");
    const q = query(messagesRef, orderBy("timestamp"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, [appointment.id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      await addDoc(collection(db, "chats", appointment.id, "messages"), {
        text: newMessage,
        senderId: currentUser.uid,
        receiverId: appointment.doctorId, // Assuming you have doctorId in appointment
        timestamp: new Date(),
      });
      setNewMessage("");
    }
  };

  return (
    <div className="fixed bottom-0 right-0 w-full max-w-md p-4 bg-white shadow-lg rounded-lg">
      <div className="h-64 overflow-y-scroll mb-4">
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
      <form onSubmit={handleSendMessage} className="flex">
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
  );
};

export default ChatBox;
