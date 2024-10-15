import React from "react";

const ChatHeader = ({ receiverName }) => {
  return (
    <div className="bg-blue-600 p-4 rounded-t-lg shadow-md">
      <h2 className="text-white text-lg font-semibold">
        {receiverName || "Chat"}
      </h2>
    </div>
  );
};

export default ChatHeader;
