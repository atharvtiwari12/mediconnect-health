import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Login
        </h2>
        {errorMessage && (
          <p className="text-red-500 text-center mb-4">{errorMessage}</p>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-bold py-2 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring focus:ring-indigo-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
