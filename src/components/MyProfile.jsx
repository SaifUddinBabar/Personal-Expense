// MyProfile.jsx
import React, { useState } from "react";
import { useAuth } from "../AuthContext"; 
import { toast, ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";

const MyProfile = () => {
  const { user, updateUserProfile } = useAuth();
  const [formData, setFormData] = useState({
    displayName: user?.displayName || "",
    photoURL: user?.photoURL || "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateUserProfile(formData.displayName, formData.photoURL);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md space-y-4"
      >
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-4">
          My Profile
        </h2>

        <div className="flex flex-col items-center">
          <img
            src={formData.photoURL || "/default-profile.png"}
            alt="Profile"
            className="w-24 h-24 rounded-full mb-4 object-cover"
          />
          <input
            type="text"
            name="photoURL"
            value={formData.photoURL}
            onChange={handleChange}
            placeholder="Photo URL"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <input
          type="text"
          name="displayName"
          value={formData.displayName}
          onChange={handleChange}
          placeholder="Name"
          required
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="email"
          value={user?.email}
          readOnly
          className="w-full border border-gray-300 rounded-lg p-3 bg-gray-100 cursor-not-allowed"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full mt-4 py-3 rounded-lg font-semibold transition-all ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default MyProfile;
