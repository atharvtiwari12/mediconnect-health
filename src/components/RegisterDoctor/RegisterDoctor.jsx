import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import "./RegisterDoctor.css";

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
    profilePicture: "",
    bio: "",
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
        profilePicture,
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
    <div className="register-doctor">
      <h2>Register as a Doctor</h2>
      <form onSubmit={handleRegister}>
        <label>Full Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>Date of Birth</label>
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          required
        />

        <label>Email Address</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <label>Phone Number</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <label>Gender</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <label>Medical License Number</label>
        <input
          type="text"
          name="licenseNumber"
          value={formData.licenseNumber}
          onChange={handleChange}
          required
        />

        <label>Specialization</label>
        <input
          type="text"
          name="specialization"
          value={formData.specialization}
          onChange={handleChange}
          required
        />

        <label>Qualifications</label>
        <input
          type="text"
          name="qualifications"
          value={formData.qualifications}
          onChange={handleChange}
          required
        />

        <label>Years of Experience</label>
        <input
          type="number"
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          required
        />

        <label>Medical School/College Attended</label>
        <input
          type="text"
          name="college"
          value={formData.college}
          onChange={handleChange}
          required
        />

        <label>Clinic/Workplace Address</label>
        <input
          type="text"
          name="clinicAddress"
          value={formData.clinicAddress}
          onChange={handleChange}
          required
        />

        <label>Profile Picture (URL)</label>
        <input
          type="text"
          name="profilePicture"
          value={formData.profilePicture}
          onChange={handleChange}
        />

        <label>Short Bio</label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
        ></textarea>

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterDoctor;
