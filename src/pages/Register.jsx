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
    if (password.length < 6) return "Password must be at least 6 characters long.";
    if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter.";
    if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter.";
    return null;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    const name = e.target.name.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;
    const photo = e.target.photo.value.trim();

    const validationError = validatePassword(password);
    if (validationError) {
      Swal.fire("Validation Error", validationError, "error");
      setLoading(false);
      return;
    }

    try {
      const res = await register(email, password); // Firebase createUserWithEmailAndPassword
      if (res.user) {
        await updateProfile(res.user, { displayName: name, photoURL: photo || "" });
      }

      Swal.fire("Success!", "Registration successful. Welcome to FinEase!", "success");
      navigate("/");
    } catch (error) {
      const msg = error.message.replace("Firebase: Error ", "").replace(/\(auth.*\)\.?/g, "").trim();
      Swal.fire("Registration Failed", msg, "error");
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
      const msg = error.message.replace("Firebase: Error ", "").replace(/\(auth.*\)\.?/g, "").trim();
      Swal.fire("Google Login Failed", msg, "error");
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

        <input type="text" name="name" placeholder="Full Name" required className={inputClass()} />
        <input type="email" name="email" placeholder="Email Address" required className={inputClass()} />
        <input type="password" name="password" placeholder="Password (6+ chars, 1 Uppercase, 1 Lowercase)" required className={inputClass()} />
        <input type="text" name="photo" placeholder="Photo URL (optional)" className={inputClass()} />

        <button type="submit" disabled={loading} className={btnClass()}>
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-gray-400 dark:text-gray-500 text-center py-2">OR CONTINUE WITH</p>
        <button type="button" onClick={handleGoogleLogin} disabled={loading} className={googleBtnClass()}>
          <svg width="20" height="20" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <path fill="#4285f4" d="M256 133c36 0 68 12 93 32l70-70C376 45 316 16 256 16 146 16 58 96 58 207c0 28 6 54 16 77l78-60c-8-20-12-41-12-64 0-49 39-88 88-88z"/>
            <path fill="#34a853" d="M256 379c-34 0-65-12-89-32l-70 70C136 467 196 496 256 496c110 0 198-80 198-191 0-28-6-54-16-77l-78 60c8 20 12 41 12 64 0 49-39 88-88 88z"/>
            <path fill="#fbbc02" d="M153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55l63 49c12 37 0 73 0 73z"/>
            <path fill="#ea4335" d="M386 400a140 175 0 0053-179H260v74h102c-7 37-38 57-38 57z"/>
          </svg>
          <span className="text-sm font-medium ml-2">Login with Google</span>
        </button>

        <p className="text-center text-gray-600 dark:text-gray-400 mt-4">
          Already have an account? <a href="/login" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Sign In</a>
        </p>
      </motion.form>
    </div>
  );
};

// Input classes
const inputClass = () =>
  "w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400";

// Button classes
const btnClass = () =>
  "w-full mt-4 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all font-semibold disabled:bg-gray-400";

const googleBtnClass = () =>
  "flex items-center justify-center w-full py-3 bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all gap-3 disabled:opacity-50";

export default Register;
