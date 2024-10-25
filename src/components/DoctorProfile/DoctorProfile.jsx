import React, { useEffect, useState } from "react";
import { auth, db, storage } from "../../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          Update Doctor Profile
        </h2>
        <form onSubmit={handleUpdate}>
          {/* Full Name */}
          <div className="flex items-center mb-4">
            <label className="w-1/3 text-sm font-medium text-gray-700">
              Full Name:
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-2/3 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Date of Birth */}
          <div className="flex items-center mb-4">
            <label className="w-1/3 text-sm font-medium text-gray-700">
              Date of Birth:
            </label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="w-2/3 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Email */}
          <div className="flex items-center mb-4">
            <label className="w-1/3 text-sm font-medium text-gray-700">
              Email Address:
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-2/3 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled
            />
          </div>

          {/* Phone */}
          <div className="flex items-center mb-4">
            <label className="w-1/3 text-sm font-medium text-gray-700">
              Phone Number:
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-2/3 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Gender */}
          <div className="flex items-center mb-4">
            <label className="w-1/3 text-sm font-medium text-gray-700">
              Gender:
            </label>
            <input
              type="text"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-2/3 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Medical License Number */}
          <div className="flex items-center mb-4">
            <label className="w-1/3 text-sm font-medium text-gray-700">
              Medical License Number:
            </label>
            <input
              type="text"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleChange}
              className="w-2/3 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Specialization */}
          <div className="flex items-center mb-4">
            <label className="w-1/3 text-sm font-medium text-gray-700">
              Specialization:
            </label>
            <input
              type="text"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              className="w-2/3 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Qualifications */}
          <div className="flex items-center mb-4">
            <label className="w-1/3 text-sm font-medium text-gray-700">
              Qualifications:
            </label>
            <input
              type="text"
              name="qualifications"
              value={formData.qualifications}
              onChange={handleChange}
              className="w-2/3 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Years of Experience */}
          <div className="flex items-center mb-4">
            <label className="w-1/3 text-sm font-medium text-gray-700">
              Years of Experience:
            </label>
            <input
              type="number"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="w-2/3 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Medical School/College Attended */}
          <div className="flex items-center mb-4">
            <label className="w-1/3 text-sm font-medium text-gray-700">
              Medical School/College:
            </label>
            <input
              type="text"
              name="college"
              value={formData.college}
              onChange={handleChange}
              className="w-2/3 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Clinic Address */}
          <div className="flex items-center mb-4">
            <label className="w-1/3 text-sm font-medium text-gray-700">
              Clinic Address:
            </label>
            <input
              type="text"
              name="clinicAddress"
              value={formData.clinicAddress}
              onChange={handleChange}
              className="w-2/3 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Profile Picture */}
          <div className="flex items-center mb-4">
            <label className="w-1/3 text-sm font-medium text-gray-700">
              Profile Picture:
            </label>
            <input
              type="file"
              name="profilePicture"
              accept="image/*"
              onChange={handleChange}
              className="w-2/3 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Profile Picture Preview */}
          {profilePictureURL && (
            <div className="flex justify-center mb-4">
              <img
                src={profilePictureURL}
                alt="Profile Preview"
                className="w-32 h-32 rounded-full object-cover"
              />
            </div>
          )}

          {/* Short Bio */}
          <div className="flex items-center mb-4">
            <label className="w-1/3 text-sm font-medium text-gray-700">
              Short Bio:
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-2/3 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="A short description about yourself"
            ></textarea>
          </div>

          {/* Update Button */}
          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-300"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorProfile;
