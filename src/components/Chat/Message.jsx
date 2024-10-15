// Message.js
import React from "react";

const Message = ({ senderName, text, timestamp, isCurrentUser }) => {
  // Convert Firestore Timestamp to JavaScript Date
  const messageDate = timestamp ? timestamp.toDate() : new Date(); // Fallback to current date if timestamp is invalid
  const timeString = messageDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`flex flex-col ${
        isCurrentUser ? "items-end" : "items-start"
      } mb-2`}
    >
      <span
        className={`text-sm font-semibold ${
          isCurrentUser ? "text-blue-500" : "text-gray-700"
        }`}
      >
        {senderName}
      </span>
      <div
        className={`p-3 rounded-lg shadow ${
          isCurrentUser ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
        }`}
      >
        {text}
      </div>
      <span className="text-xs text-gray-500 mt-1">{timeString}</span>
    </div>
  );
};

export default Message;
