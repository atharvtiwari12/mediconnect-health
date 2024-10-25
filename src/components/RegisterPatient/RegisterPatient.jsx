import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, storage } from "../../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const RegisterPatient = () => {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
    address: "",
    profilePicture: null,
    bloodGroup: "",
    height: "",
    weight: "",
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
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
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
      address,
      profilePicture,
      bloodGroup,
      height,
      weight,
    } = formData;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      let profileImageURL = "";
      if (profilePicture) {
        const storageRef = ref(storage, `profilePictures/${user.uid}`);
        await uploadBytes(storageRef, profilePicture);
        profileImageURL = await getDownloadURL(storageRef);
      }

      await sendEmailVerification(user);
      alert(
        "A verification email has been sent to your email address. Please verify your email."
      );

      const age = calculateAge(dob);

      await setDoc(doc(db, "patients", user.uid), {
        name,
        dob,
        age,
        email,
        phone,
        gender,
        address,
        profilePicture: profileImageURL || null,
        bloodGroup: bloodGroup || null,
        height: height ? height : 0,
        weight: weight ? weight : 0,
        role: "patient",
      });

      navigate("/verify-email");
    } catch (error) {
      console.error("Error registering patient:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Register as a Patient
        </h2>
        <form onSubmit={handleRegister} className="space-y-6">
          {/* Name Field */}
          <div className="flex items-center space-x-4">
            <label htmlFor="name" className="w-32 text-gray-700 font-medium">
              Name:
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
            <label htmlFor="dob" className="w-32 text-gray-700 font-medium">
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
            <label htmlFor="email" className="w-32 text-gray-700 font-medium">
              Email:
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
              className="w-32 text-gray-700 font-medium"
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
            <label htmlFor="phone" className="w-32 text-gray-700 font-medium">
              Phone:
            </label>
            <input
              type="tel"
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
            <label htmlFor="gender" className="w-32 text-gray-700 font-medium">
              Gender:
            </label>
            <input
              type="text"
              name="gender"
              id="gender"
              placeholder="Gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
            />
          </div>

          {/* Address Field */}
          <div className="flex items-center space-x-4">
            <label htmlFor="address" className="w-32 text-gray-700 font-medium">
              Address:
            </label>
            <input
              type="text"
              name="address"
              id="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              required
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
            />
          </div>

          {/* Profile Picture Field */}
          <div className="flex items-center space-x-4">
            <label
              htmlFor="profilePicture"
              className="w-32 text-gray-700 font-medium"
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

          {/* Blood Group Field */}
          <div className="flex items-center space-x-4">
            <label
              htmlFor="bloodGroup"
              className="w-32 text-gray-700 font-medium"
            >
              Blood Group:
            </label>
            <input
              type="text"
              name="bloodGroup"
              id="bloodGroup"
              placeholder="Blood Group (optional)"
              value={formData.bloodGroup}
              onChange={handleChange}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
            />
          </div>

          {/* Height Field */}
          <div className="flex items-center space-x-4">
            <label htmlFor="height" className="w-32 text-gray-700 font-medium">
              Height (cm):
            </label>
            <input
              type="number"
              name="height"
              id="height"
              placeholder="Height (optional)"
              value={formData.height}
              onChange={handleChange}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
            />
          </div>

          {/* Weight Field */}
          <div className="flex items-center space-x-4">
            <label htmlFor="weight" className="w-32 text-gray-700 font-medium">
              Weight (kg):
            </label>
            <input
              type="number"
              name="weight"
              id="weight"
              placeholder="Weight (optional)"
              value={formData.weight}
              onChange={handleChange}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
            />
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

export default RegisterPatient;
