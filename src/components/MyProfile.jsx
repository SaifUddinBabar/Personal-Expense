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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50/20 to-purple-50/20 dark:from-gray-900/20 dark:to-gray-800/20 p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <form
        onSubmit={handleSubmit}
        className="backdrop-blur-md bg-white/40 dark:bg-gray-700/40 border border-white/50 dark:border-gray-600 shadow-lg rounded-3xl p-10 w-full max-w-md space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
          My Profile
        </h2>

        <div className="flex flex-col items-center">
          <div className="w-28 h-28 rounded-full overflow-hidden shadow-md mb-4 border border-white/50 dark:border-gray-600">
            <img
              src={formData.photoURL || "/default-profile.png"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <input
            type="text"
            name="photoURL"
            value={formData.photoURL}
            onChange={handleChange}
            placeholder="Photo URL"
            className="w-full border border-white/50 dark:border-gray-600 bg-white/20 dark:bg-gray-700/50 rounded-lg p-3 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <input
          type="text"
          name="displayName"
          value={formData.displayName}
          onChange={handleChange}
          placeholder="Name"
          required
          className="w-full border border-white/50 dark:border-gray-600 bg-white/20 dark:bg-gray-700/50 rounded-lg p-3 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="email"
          value={user?.email}
          readOnly
          className="w-full border border-white/50 dark:border-gray-600 bg-white/20 dark:bg-gray-700/50 rounded-lg p-3 text-gray-900 dark:text-gray-200 cursor-not-allowed"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl backdrop-blur-md bg-blue-500/80 border border-blue-500/30 text-white font-semibold hover:bg-blue-600 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default MyProfile;
