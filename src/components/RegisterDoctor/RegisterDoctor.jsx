import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, storage } from "../../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./RegisterDoctor.css"; // Ensure you have the correct styling

const RegisterDoctor = () => {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
    licenseNumber: "",
    specialization: "",
    qualifications: "",
    experience: "",
    college: "",
    clinicAddress: "",
    profilePicture: null,
    bio: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.name === "profilePicture") {
      setFormData({
        ...formData,
        profilePicture: e.target.files[0],
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const ageDiff = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDiff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const {
      name,
      dob,
      email,
      password,
      phone,
      gender,
      licenseNumber,
      specialization,
      qualifications,
      experience,
      college,
      clinicAddress,
      bio,
      profilePicture,
    } = formData;
    const age = calculateAge(dob);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Upload profile picture if provided
      let profileImageURL = "";
      if (profilePicture) {
        const storageRef = ref(storage, `profilePictures/${user.uid}`);
        await uploadBytes(storageRef, profilePicture);
        profileImageURL = await getDownloadURL(storageRef);
      }

      // Send email verification
      await sendEmailVerification(user);
      alert(
        "A verification email has been sent to your email address. Please verify your email."
      );

      const doctorID = `DOC-${Date.now()}`;

      // Save doctor's details in Firestore
      await setDoc(doc(db, "doctors", user.uid), {
        name,
        dob,
        age,
        email,
        phone,
        gender,
        licenseNumber,
        specialization,
        qualifications,
        experience,
        college,
        clinicAddress,
        profilePicture: profileImageURL || null,
        bio,
        doctorID,
        role: "doctor",
      });

      navigate("/verify-email");
    } catch (error) {
      console.error("Error registering doctor:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Register as a Doctor
        </h2>
        <form onSubmit={handleRegister} className="space-y-6">
          {/* Full Name Field */}
          <div className="flex items-center space-x-4">
            <label htmlFor="name" className="w-48 text-gray-700 font-medium">
              Full Name:
            </label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
            />
          </div>

          {/* Date of Birth Field */}
          <div className="flex items-center space-x-4">
            <label htmlFor="dob" className="w-48 text-gray-700 font-medium">
              Date of Birth:
            </label>
            <input
              type="date"
              name="dob"
              id="dob"
              value={formData.dob}
              onChange={handleChange}
              required
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
            />
          </div>

          {/* Email Field */}
          <div className="flex items-center space-x-4">
            <label htmlFor="email" className="w-48 text-gray-700 font-medium">
              Email Address:
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
            />
          </div>

          {/* Password Field */}
          <div className="flex items-center space-x-4">
            <label
              htmlFor="password"
              className="w-48 text-gray-700 font-medium"
            >
              Password:
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
            />
          </div>

          {/* Phone Field */}
          <div className="flex items-center space-x-4">
            <label htmlFor="phone" className="w-48 text-gray-700 font-medium">
              Phone Number:
            </label>
            <input
              type="text"
              name="phone"
              id="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
            />
          </div>

          {/* Gender Field */}
          <div className="flex items-center space-x-4">
            <label htmlFor="gender" className="w-48 text-gray-700 font-medium">
              Gender:
            </label>
            <select
              name="gender"
              id="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Medical License Number Field */}
          <div className="flex items-center space-x-4">
            <label
              htmlFor="licenseNumber"
              className="w-48 text-gray-700 font-medium"
            >
              Medical License Number:
            </label>
            <input
              type="text"
              name="licenseNumber"
              id="licenseNumber"
              placeholder="License Number"
              value={formData.licenseNumber}
              onChange={handleChange}
              required
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
            />
          </div>

          {/* Specialization Field */}
          <div className="flex items-center space-x-4">
            <label
              htmlFor="specialization"
              className="w-48 text-gray-700 font-medium"
            >
              Specialization:
            </label>
            <input
              type="text"
              name="specialization"
              id="specialization"
              placeholder="Specialization"
              value={formData.specialization}
              onChange={handleChange}
              required
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
            />
          </div>

          {/* Qualifications Field */}
          <div className="flex items-center space-x-4">
            <label
              htmlFor="qualifications"
              className="w-48 text-gray-700 font-medium"
            >
              Qualifications:
            </label>
            <input
              type="text"
              name="qualifications"
              id="qualifications"
              placeholder="Qualifications"
              value={formData.qualifications}
              onChange={handleChange}
              required
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
            />
          </div>

          {/* Years of Experience Field */}
          <div className="flex items-center space-x-4">
            <label
              htmlFor="experience"
              className="w-48 text-gray-700 font-medium"
            >
              Years of Experience:
            </label>
            <input
              type="number"
              name="experience"
              id="experience"
              placeholder="Experience (in years)"
              value={formData.experience}
              onChange={handleChange}
              required
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
            />
          </div>

          {/* Medical School/College Field */}
          <div className="flex items-center space-x-4">
            <label htmlFor="college" className="w-48 text-gray-700 font-medium">
              Medical School/College:
            </label>
            <input
              type="text"
              name="college"
              id="college"
              placeholder="College Name"
              value={formData.college}
              onChange={handleChange}
              required
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
            />
          </div>

          {/* Clinic Address Field */}
          <div className="flex items-center space-x-4">
            <label
              htmlFor="clinicAddress"
              className="w-48 text-gray-700 font-medium"
            >
              Clinic Address:
            </label>
            <input
              type="text"
              name="clinicAddress"
              id="clinicAddress"
              placeholder="Clinic Address"
              value={formData.clinicAddress}
              onChange={handleChange}
              required
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
            />
          </div>

          {/* Profile Picture Upload */}
          <div className="flex items-center space-x-4">
            <label
              htmlFor="profilePicture"
              className="w-48 text-gray-700 font-medium"
            >
              Profile Picture:
            </label>
            <input
              type="file"
              name="profilePicture"
              id="profilePicture"
              accept="image/*"
              onChange={handleChange}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
            />
          </div>

          {/* Short Bio Field */}
          <div className="flex items-center space-x-4">
            <label htmlFor="bio" className="w-48 text-gray-700 font-medium">
              Short Bio:
            </label>
            <textarea
              name="bio"
              id="bio"
              placeholder="Tell us about yourself"
              value={formData.bio}
              onChange={handleChange}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-8">
            <button
              type="submit"
              className="w-full max-w-md bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterDoctor;
