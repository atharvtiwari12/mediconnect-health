// Sidebar.js
import React from "react";

const Sidebar = ({ users, isDoctor }) => {
  return (
    <div className="bg-white shadow-md p-4 rounded-lg">
      <h2 className="text-lg font-bold mb-4">
        {isDoctor ? "Patients" : "Doctors"}
      </h2>
      <ul className="space-y-2">
        {users.map((user) => (
          <li
            key={user.id}
            className="p-2 bg-gray-100 rounded hover:bg-gray-200 transition cursor-pointer"
          >
            {isDoctor ? user.patientName : user.doctorName}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
