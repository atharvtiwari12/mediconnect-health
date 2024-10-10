import React, { useEffect, useState } from "react";
import { auth, db, storage } from "../../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import "./DoctorProfile.css";

const DoctorProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    email: "",
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

  const [profilePictureURL, setProfilePictureURL] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "doctors", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setFormData({
            ...userData,
            profilePicture: userData.profilePicture || null,
          });
          setProfilePictureURL(userData.profilePicture || null);
        }
      } else {
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleChange = (e) => {
    if (e.target.name === "profilePicture") {
      const file = e.target.files[0];
      setFormData({
        ...formData,
        profilePicture: file,
      });
      setProfilePictureURL(URL.createObjectURL(file));
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const { profilePicture } = formData;

    try {
      const user = auth.currentUser;
      let profileImageURL = formData.profilePicture;

      if (profilePicture instanceof File) {
        const storageRef = ref(storage, `profilePictures/${user.uid}`);
        await uploadBytes(storageRef, profilePicture);
        profileImageURL = await getDownloadURL(storageRef);
      }

      await updateDoc(doc(db, "doctors", user.uid), {
        ...formData,
        profilePicture: profileImageURL || null,
      });

      alert("Profile updated successfully!");
      navigate("/doctor-dashboard");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="update-profile">
      <h2>Update Doctor Profile</h2>
      <form onSubmit={handleUpdate}>
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
          disabled
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
          name="licenseNumber"
          placeholder="Medical License Number"
          value={formData.licenseNumber}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="specialization"
          placeholder="Specialization"
          value={formData.specialization}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="qualifications"
          placeholder="Qualifications"
          value={formData.qualifications}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="experience"
          placeholder="Years of Experience"
          value={formData.experience}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="college"
          placeholder="Medical School/College Attended"
          value={formData.college}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="clinicAddress"
          placeholder="Clinic/Workplace Address"
          value={formData.clinicAddress}
          onChange={handleChange}
          required
        />
        <input
          type="file"
          name="profilePicture"
          accept="image/*"
          onChange={handleChange}
        />
        {profilePictureURL && (
          <img
            src={profilePictureURL}
            alt="Profile Preview"
            style={{ width: "150px", height: "150px", borderRadius: "50%" }}
          />
        )}
        <textarea
          name="bio"
          placeholder="Short Bio"
          value={formData.bio}
          onChange={handleChange}
        ></textarea>
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default DoctorProfile;
