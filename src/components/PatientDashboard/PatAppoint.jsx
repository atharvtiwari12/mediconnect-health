import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useAuth } from "../../firebaseConfig"; // Assumed AuthContext for handling auth
import { Modal, Box, Button, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MicNoneIcon from "@mui/icons-material/MicNone";
import "./PatAppoint.css"; // Assuming a CSS file for styling
import download from "../../assets/download.jpeg"; // Placeholder image

const PatAppoint = ({ patientData }) => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const { currentUser } = useAuth(); // Get current user

  // Specializations for filtering
  const specializations = [
    "MD",
    "Dermatologist",
    "MBBS",
    "Cardiologist",
    "Pediatrician",
  ];

  // Fetch doctors from Firestore on component mount
  useEffect(() => {
    const fetchDoctors = async () => {
      const doctorCollection = collection(db, "doctors");
      const doctorSnapshot = await getDocs(doctorCollection);
      const doctorList = doctorSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDoctors(doctorList);
      setFilteredDoctors(doctorList); // Initially show all doctors
    };
    fetchDoctors();
  }, []);

  // Filter doctors by name and specialization
  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);
    const filtered = doctors.filter(
      (doctor) =>
        doctor.name.toLowerCase().includes(searchValue) &&
        (selectedSpecialization === "" ||
          doctor.specialization === selectedSpecialization)
    );
    setFilteredDoctors(filtered);
  };

  const handleSpecializationChange = (e) => {
    const specialization = e.target.value;
    setSelectedSpecialization(specialization);
    const filtered = doctors.filter(
      (doctor) =>
        (specialization === "" || doctor.specialization === specialization) &&
        doctor.name.toLowerCase().includes(searchTerm)
    );
    setFilteredDoctors(filtered);
  };

  // Modal open and close
  const handleOpenModal = (doctor) => {
    setSelectedDoctor(doctor);
    setOpenModal(true);
    setSelectedDate("");
    setSelectedTime("");
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedDoctor(null);
    setSelectedDate("");
    setSelectedTime("");
  };

  // Handle appointment booking
  const handleBookAppointment = async () => {
    if (!currentUser) {
      alert("Please log in to book an appointment.");
      handleCloseModal();
      return;
    }

    if (!selectedDoctor || !selectedDate || !selectedTime) {
      alert("Please select a doctor, date, and time.");
      return;
    }
    console.log("Patient Data: ", patientData);

    const appointmentData = {
      doctorId: selectedDoctor.id,
      patientId: currentUser.uid,
      doctorName: selectedDoctor.name,
      patientName: patientData?.name || "Anonymous", // Use patient name if available
      status: "pending",
      createdAt: new Date(),
      date: selectedDate,
      time: selectedTime,
    };

    try {
      const appointmentsRef = collection(db, "appointments");
      await addDoc(appointmentsRef, appointmentData);
      alert("Appointment booked successfully!");
      handleCloseModal();
    } catch (error) {
      console.error("Error booking appointment: ", error);
      alert("Error booking appointment, please try again later.");
    }
  };

  return (
    <div className="pat-container">
      <div className="feed-head">
        <h6>Pages {location.pathname}</h6>
        {/* Search Input */}
        <div className="search-par">
          <div className="search">
            <SearchIcon fontSize="small" color="disabled" />
            <input
              className="input"
              type="search"
              placeholder="Search doctors..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <MicNoneIcon fontSize="small" color="disabled" className="vc" />
          </div>
        </div>
      </div>

      {/* Specialization Filter */}
      <div className="cards-head">
        <div className="drop">
          <p>Specialization</p>
          <select
            className="specialization-dropdown"
            value={selectedSpecialization}
            onChange={handleSpecializationChange}
          >
            <option value="">All Specializations</option>
            {specializations.map((specialization, index) => (
              <option key={index} value={specialization}>
                {specialization}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Display Doctors */}
      <div className="cards-body">
        <div className="card-container">
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor, index) => (
              <div key={index} className="doctor-card">
                <div className="doctor-image-section">
                  <img
                    src={doctor.profilePicture || download}
                    alt={doctor.name}
                    className="doctor-image"
                  />
                  <p className="doctor-name">{doctor.name}</p>
                </div>
                <div className="doctor-info-section">
                  <p>
                    <strong>Specialization:</strong> {doctor.specialization}
                  </p>
                  <p>
                    <strong>Experience:</strong> {doctor.experience} years
                  </p>
                  <p>
                    <strong>Clinic:</strong> {doctor.clinicAddress}
                  </p>
                  <button
                    className="book-appointment-btn"
                    onClick={() => handleOpenModal(doctor)}
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No doctors found</p>
          )}
        </div>
      </div>

      {/* Modal for booking appointment */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2">
            Book Appointment with {selectedDoctor?.name}
          </Typography>
          <div style={{ marginTop: "16px" }}>
            <Typography>Select Date:</Typography>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{ margin: "8px 0" }}
            />
            <Typography>Select Time:</Typography>
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              style={{ margin: "8px 0" }}
            />
          </div>

          <Button
            variant="contained"
            color="primary"
            onClick={handleBookAppointment}
            sx={{ mt: 2 }}
          >
            Confirm Appointment
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleCloseModal}
            sx={{ mt: 2, ml: 2 }}
          >
            Cancel
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default PatAppoint;
