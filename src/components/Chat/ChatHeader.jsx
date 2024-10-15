import React from "react";

const ChatHeader = ({ receiverName }) => {
  return (
    <div className="bg-gray-200 p-2 rounded-t-lg">
      <h2 className="font-bold text-lg">{receiverName}</h2>
    </div>
  );
};

export default ChatHeader;
