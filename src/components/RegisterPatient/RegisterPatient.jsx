import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, storage } from "../../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
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
    <div className="register-patient">
      <h2>Register as a Patient</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="gender"
          placeholder="Gender"
          value={formData.gender}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          required
        />
        <input
          type="file"
          name="profilePicture"
          accept="image/*"
          onChange={handleChange}
        />
        <input
          type="text"
          name="bloodGroup"
          placeholder="Blood Group (optional)"
          value={formData.bloodGroup}
          onChange={handleChange}
        />
        <input
          type="number"
          name="height"
          placeholder="Height (in cm, optional)"
          value={formData.height}
          onChange={handleChange}
        />
        <input
          type="number"
          name="weight"
          placeholder="Weight (in kg, optional)"
          value={formData.weight}
          onChange={handleChange}
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterPatient;
