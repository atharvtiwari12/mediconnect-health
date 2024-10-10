import React, { useState } from "react";
import "./BookAppointmentModal.css";

const BookAppointmentModal = ({ isOpen, onClose, doctorName }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const handleBooking = () => {
    console.log(
      `Booking appointment with ${doctorName} on ${selectedDate} at ${selectedTime}`
    );
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Book Appointment with {doctorName}</h2>
        <p>
          Are you sure you want to book an appointment with Dr. {doctorName}?
        </p>

        <div className="date-time-selection">
          <label htmlFor="date">Select Date:</label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />

          <label htmlFor="time">Select Time:</label>
          <input
            type="time"
            id="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
          />
        </div>

        <button onClick={handleBooking}>Confirm Booking</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default BookAppointmentModal;
