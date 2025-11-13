import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { updateProfile } from "firebase/auth";
import Loader from "../components/Loader";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

const Register = () => {
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const validatePassword = (password) => {
    if (password.length < 6) {
      return "Password must be at least 6 characters long.";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter.";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter.";
    }
    return null; 
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const photo = e.target.photo.value;

    const validationError = validatePassword(password);
    if (validationError) {
      Swal.fire("Validation Error", validationError, "error");
      setLoading(false);
      return;
    }

    try {
      const res = await register(email, password);
      await updateProfile(res.user, { displayName: name, photoURL: photo || "" });
      
      Swal.fire("Success!", "Registration successful. Welcome to FinEase!", "success");
      navigate("/");
    } catch (error) {
      const errorMessage = error.message.replace("Firebase: Error ", "").replace(/\(auth.*\)\.?/g, "").trim();
      Swal.fire("Registration Failed", errorMessage, "error");
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      Swal.fire("Success!", "Signed in with Google successfully.", "success");
      navigate("/");
    } catch (error) {
      const errorMessage = error.message.replace("Firebase: Error ", "").replace(/\(auth.*\)\.?/g, "").trim();
      Swal.fire("Google Login Failed", errorMessage, "error");
    }
    setLoading(false);
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <motion.form
        onSubmit={handleRegister}
        className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 w-full max-w-md space-y-4 border border-gray-100 dark:border-gray-700"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold text-center text-blue-600 dark:text-blue-400 mb-6">
          Create Your Account
        </h2>

        <input 
          type="text" 
          name="name" 
          placeholder="Full Name" 
          required 
          className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400" 
        />
        <input 
          type="email" 
          name="email" 
          placeholder="Email Address" 
          required 
          className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400" 
        />
        
        <input 
          type="password" 
          name="password" 
          placeholder="Password (Min 6 chars, 1 Uppercase, 1 Lowercase)" 
          required 
          className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400" 
        />
        <input 
          type="text" 
          name="photo" 
          placeholder="Photo URL (optional)" 
          className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400" 
        />

        <button 
          type="submit" 
          disabled={loading}
          className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all font-semibold disabled:bg-gray-400"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-gray-400 dark:text-gray-500 text-center py-2">OR CONTINUE WITH</p>
<button
  type="button"
  onClick={handleGoogleLogin}
  disabled={loading}
  className="flex items-center justify-center w-full py-3 bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all gap-3 disabled:opacity-50"
>
  <svg
    aria-label="Google logo"
    width="20"
    height="20"
    viewBox="0 0 512 512"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g>
      <path d="M0 0h512v512H0z" fill="#fff"></path>
      <path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path>
      <path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path>
      <path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path>
      <path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path>
    </g>
  </svg>

  {/* Button Text */}
  <span className="text-sm font-medium">Login with Google</span>
</button>


        <p className="text-center text-gray-600 dark:text-gray-400 mt-4">
          Already have an account? <a href="/login" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Sign In</a>
        </p>
      </motion.form>
    </div>
  );
};

export default Register;