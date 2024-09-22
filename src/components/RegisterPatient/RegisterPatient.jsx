import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import "./RegisterPatient.css";

const RegisterPatient = () => {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
    address: "",
    medicalHistory: "",
    allergies: "",
    profilePicture: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
      address,
      medicalHistory,
      allergies,
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

      await sendEmailVerification(user);
      alert(
        "A verification email has been sent to your email address. Please verify your email."
      );

      const patientID = `PAT-${Date.now()}`;

      await setDoc(doc(db, "patients", user.uid), {
        name,
        dob,
        age,
        email,
        phone,
        gender,
        address,
        medicalHistory: medicalHistory || null,
        allergies: allergies || null,
        profilePicture: profilePicture || null,
        patientID,
        role: "patient",
      });

      navigate("/verify-email");
    } catch (error) {
      console.error("Error registering patient:", error);
    }
  };

  return (
    <div className="register-patient">
      <h2>Register as a Patient</h2>
      <form onSubmit={handleRegister}>
        <label>Full Name</label>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          required
        />

        <label>Email Address</label>
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          onChange={handleChange}
          required
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />

        <label>Phone Number</label>
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          onChange={handleChange}
          required
        />

        <label>Date of Birth</label>
        <input
          type="date"
          name="dob"
          placeholder="Date of Birth"
          onChange={handleChange}
          required
        />

        <label>Gender</label>
        <select name="gender" onChange={handleChange} required>
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <label>Address</label>
        <input
          type="text"
          name="address"
          placeholder="Address"
          onChange={handleChange}
          required
        />

        <label>Medical History (Optional)</label>
        <textarea
          name="medicalHistory"
          placeholder="Medical History"
          onChange={handleChange}
        ></textarea>

        <label>Allergies (Optional)</label>
        <textarea
          name="allergies"
          placeholder="Allergies"
          onChange={handleChange}
        ></textarea>

        <label>Profile Picture (Optional)</label>
        <input type="file" name="profilePicture" onChange={handleChange} />

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterPatient;
