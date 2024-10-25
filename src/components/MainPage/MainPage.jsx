import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCalendarCheck, FaComments, FaVideo } from "react-icons/fa";
import { AiFillProfile } from "react-icons/ai";
import { GiDoctorFace } from "react-icons/gi";
import { MdMedicalServices } from "react-icons/md";
import Medicalhero from "../../assets/Medicalhero.avif"; // Adjust import if necessary

const MainPage = () => {
  const navigate = useNavigate();

  const handleDoctorRegister = () => {
    navigate("/register-doctor");
  };

  const handlePatientRegister = () => {
    navigate("/register-patient");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="flex justify-between items-center bg-white shadow-lg p-4">
        <h1 className="text-4xl font-bold text-blue-600">MediConnect</h1>
        <div className="space-x-4">
          <button
            onClick={handleDoctorRegister}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Register as Doctor
          </button>
          <button
            onClick={handlePatientRegister}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
          >
            Register as Patient
          </button>
          <button
            onClick={handleLogin}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200"
          >
            Login
          </button>
        </div>
      </header>

      {/* Hero Section */}
      {/* <div className="bg-gray-200 h-80 flex items-center justify-center text-white">
        <div className="bg-black bg-opacity-60 p-10 rounded-lg shadow-lg">
          <h2 className="text-5xl font-bold">Your Health, Our Priority</h2>
          <p className="mt-4 text-lg">
            Join MediConnect for a seamless healthcare experience.
          </p>
          <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200">
            Learn More
          </button>
        </div>
      </div> */}

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center py-10">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h2 className="text-5xl font-bold">Your Health, Our Priority</h2>
          <p className="text-lg text-gray-600 mt-4">
            MediConnect is designed to streamline your healthcare journey.
            Whether you're a patient looking for a doctor or a healthcare
            professional seeking to connect with patients, our platform
            simplifies the entire process.
          </p>
        </div>
        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mt-8">
          {[
            {
              icon: <FaCalendarCheck className="text-3xl mb-2" />,
              title: "Appointment Booking",
              description:
                "Easily schedule your appointments with your preferred doctors and get reminders for upcoming visits.",
              imageUrl: Medicalhero,
            },
            {
              icon: <FaComments className="text-3xl mb-2" />,
              title: "Secure Messaging",
              description:
                "Communicate securely with your healthcare providers and get answers to your queries without hassle.",
              imageUrl: Medicalhero,
            },
            {
              icon: <FaVideo className="text-3xl mb-2" />,
              title: "Video Consultations",
              description:
                "Experience healthcare from the comfort of your home with our easy-to-use video call feature.",
              imageUrl: Medicalhero,
            },
            {
              icon: <AiFillProfile className="text-3xl mb-2" />,
              title: "Access Medical History",
              description:
                "Keep track of your medical records and history in one secure place for easy access when needed.",
              imageUrl: Medicalhero,
            },
            {
              icon: <GiDoctorFace className="text-3xl mb-2" />,
              title: "Personalized Care",
              description:
                "Get personalized health plans and care recommendations tailored to your unique health needs.",
              imageUrl: Medicalhero,
            },
            {
              icon: <MdMedicalServices className="text-3xl mb-2" />,
              title: "Patient Dashboard",
              description:
                "A dedicated space for patients to manage appointments, messages, and health records effortlessly.",
              imageUrl: Medicalhero,
            },
          ].map(({ icon, title, description, imageUrl }, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center transition-transform transform hover:scale-105"
            >
              <div className="flex items-center mb-4">
                {icon}
                <h3 className="text-xl font-semibold ml-2">{title}</h3>
              </div>
              <img
                src={imageUrl}
                alt={title}
                className="mb-4 rounded-md shadow-sm max-w-full h-auto" // Ensures responsive image display
              />
              <p className="text-gray-600 text-center">{description}</p>
            </div>
          ))}
        </div>
        {/* Call to Action Section */}
        <div className="bg-blue-100 p-6 rounded-lg mt-10">
          <h3 className="text-2xl font-bold text-blue-600 mb-3 text-center">
            Join Our Community!
          </h3>
          <p className="text-md text-gray-600 mb-4 text-center">
            Sign up now to experience a better way to manage your health and
            connect with healthcare professionals!
          </p>

          {/* Inner Cards Container */}
          <div className="flex justify-center space-x-4 mt-2">
            {/* Register as Doctor Card */}
            <div className="bg-white rounded-lg shadow-md p-2 flex flex-col items-center transition-transform transform hover:scale-105 max-w-xs">
              <img
                src={Medicalhero} // Use a smaller image or adjust size as needed
                alt="Doctor"
                className="mb-2 rounded-md shadow-sm w-20 h-20" // Smaller size
              />
              <h4 className="text-md font-bold text-blue-600 mb-1">
                Register as Doctor
              </h4>
              <p className="text-gray-600 mb-2 text-center text-sm">
                Join our team of healthcare professionals and connect with
                patients.
              </p>
              <button
                onClick={handleDoctorRegister}
                className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 text-sm"
              >
                Register Now
              </button>
            </div>

            {/* Register as Patient Card */}
            <div className="bg-white rounded-lg shadow-md p-2 flex flex-col items-center transition-transform transform hover:scale-105 max-w-xs">
              <img
                src={Medicalhero} // Use a smaller image or adjust size as needed
                alt="Patient"
                className="mb-2 rounded-md shadow-sm w-20 h-20" // Smaller size
              />
              <h4 className="text-md font-bold text-green-600 mb-1">
                Register as Patient
              </h4>
              <p className="text-gray-600 mb-2 text-center text-sm">
                Join our community to manage your health and connect with
                doctors easily.
              </p>
              <button
                onClick={handlePatientRegister}
                className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 text-sm"
              >
                Register Now
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white shadow-md text-center p-4">
        <p className="text-gray-600">
          © 2024 MediConnect. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default MainPage;
