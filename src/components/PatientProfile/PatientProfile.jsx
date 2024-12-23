import React, { useEffect, useState } from "react";
import { auth, db, storage } from "../../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";

const PatientProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    email: "",
    phone: "",
    gender: "",
    address: "",
    profilePicture: null,
    bloodGroup: "",
    height: "",
    weight: "",
  });

  const [profilePictureURL, setProfilePictureURL] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "patients", user.uid);
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

      await updateDoc(doc(db, "patients", user.uid), {
        ...formData,
        profilePicture: profileImageURL || null,
      });

      alert("Profile updated successfully!");
      navigate("/patient-dashboard");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-xl font-bold text-gray-700 mb-8 border-b pb-4">
          Account Settings
        </h2>
        <div className="flex gap-8">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-32 h-32 bg-gray-200 rounded-lg border border-gray-300 flex items-center justify-center">
              {profilePictureURL ? (
                <img
                  src={profilePictureURL}
                  alt="Profile Preview"
                  className="w-full h-full rounded-lg object-cover"
                />
              ) : (
                <span className="text-gray-500 text-sm">Upload your photo</span>
              )}
            </div>
            <input
              type="file"
              name="profilePicture"
              accept="image/*"
              onChange={handleChange}
              className="text-xs text-blue-500 mt-2"
            />
          </div>

          {/* Form Section */}
          <form
            onSubmit={handleUpdate}
            className="flex-grow grid grid-cols-2 gap-6"
          >
            <div className="col-span-1">
              <label className="text-gray-600 text-sm mb-1 block">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="col-span-1">
              <label className="text-gray-600 text-sm mb-1 block">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
                disabled
              />
            </div>

            <div className="col-span-1">
              <label className="text-gray-600 text-sm mb-1 block">
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="col-span-1">
              <label className="text-gray-600 text-sm mb-1 block">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="col-span-1">
              <label className="text-gray-600 text-sm mb-1 block">Gender</label>
              <input
                type="text"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="col-span-1">
              <label className="text-gray-600 text-sm mb-1 block">
                Blood Group
              </label>
              <input
                type="text"
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="col-span-1">
              <label className="text-gray-600 text-sm mb-1 block">
                Height (cm)
              </label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="col-span-1">
              <label className="text-gray-600 text-sm mb-1 block">
                Weight (kg)
              </label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="col-span-2">
              <label className="text-gray-600 text-sm mb-1 block">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Update and Reset Buttons */}
            <div className="col-span-2 flex gap-4 mt-6">
              <button
                type="submit"
                className="w-1/2 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
              >
                Update Profile
              </button>
              <button
                type="reset"
                className="w-1/2 bg-gray-200 text-gray-600 py-3 rounded-lg font-semibold hover:bg-gray-300 transition duration-300"
                onClick={() =>
                  setFormData({
                    name: "",
                    dob: "",
                    email: "",
                    phone: "",
                    gender: "",
                    address: "",
                    profilePicture: null,
                    bloodGroup: "",
                    height: "",
                    weight: "",
                  })
                }
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
