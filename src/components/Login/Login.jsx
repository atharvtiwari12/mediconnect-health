import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const doctorDoc = await getDoc(doc(db, "doctors", user.uid));
      const patientDoc = await getDoc(doc(db, "patients", user.uid));

      if (doctorDoc.exists()) {
        navigate("/doctor-dashboard");
      } else if (patientDoc.exists()) {
        navigate("/patient-dashboard");
      } else {
        setErrorMessage("User role not found.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setErrorMessage("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="login">
      <h2>Login</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
