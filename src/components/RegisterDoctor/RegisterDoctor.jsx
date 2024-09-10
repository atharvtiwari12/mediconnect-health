import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import "./RegisterDoctor.css";

const RegisterDoctor = () => {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    email: "",
    password: "",
    college: "",
    experience: "",
    specialization: "",
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
    const { name, dob, email, password, college, experience, specialization } =
      formData;
    const age = calculateAge(dob);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const doctorID = `DOC-${Date.now()}`;

      await setDoc(doc(db, "doctors", user.uid), {
        name,
        dob,
        age,
        email,
        college,
        experience,
        specialization,
        doctorID,
        role: "doctor",
      });

      navigate("/doctor-dashboard");
    } catch (error) {
      console.error("Error registering doctor:", error);
    }
  };

  return (
    <div className="register-doctor">
      <h2>Register as a Doctor</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="dob"
          placeholder="DOB"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="college"
          placeholder="Studied from which college"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="experience"
          placeholder="Years of experience"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="specialization"
          placeholder="Specialization"
          onChange={handleChange}
          required
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterDoctor;
