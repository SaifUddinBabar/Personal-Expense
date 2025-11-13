import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";
import Loader from "../components/Loader";
import Swal from "sweetalert2"; 
import { motion } from "framer-motion"; 

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || "/";

  const handleSignin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    setLoading(true);
    try {
      await login(email, password);
      
      Swal.fire({
        icon: 'success',
        title: 'Login Successful!',
        text: 'Welcome back to your financial dashboard.',
        timer: 2000,
        showConfirmButton: false
      });
      
      navigate(from, { replace: true });
    } catch (err) {

      const errorMessage = err.message.replace("Firebase: Error ", "").replace(/\(auth.*\)\.?/g, "").trim();
      Swal.fire("Login Failed", errorMessage, "error");
      
      console.error(err.message);
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      
      // Success Notification
      Swal.fire({
        icon: 'success',
        title: 'Signed in with Google!',
        text: 'You have successfully logged in.',
        timer: 2000,
        showConfirmButton: false
      });
      
      navigate(from, { replace: true });
    } catch (err) {
      const errorMessage = err.message.replace("Firebase: Error ", "").replace(/\(auth.*\)\.?/g, "").trim();
      Swal.fire("Google Login Failed", errorMessage, "error");
      
      console.error(err.message);
    }
    setLoading(false);
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <motion.form
        onSubmit={handleSignin}
        className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 w-full max-w-md space-y-4 border border-gray-100 dark:border-gray-700"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold text-center text-blue-600 dark:text-blue-400 mb-6">
          Sign In
        </h2>

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
          placeholder="Password"
          required
          className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

=        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Login
        </button>

        <p className="text-gray-400 dark:text-gray-500 text-center py-2">OR CONTINUE WITH</p>

        <button
          onClick={handleGoogleLogin}
          type="button"
          disabled={loading}
          className="flex items-center justify-center w-full py-3 bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all gap-2 disabled:opacity-50"
        >
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_and_wordmark_of_Google_G_Suite.svg" 
            alt="Google" 
            className="w-5 h-5" 
          />
          Login with Google
        </button>

        <p className="text-center text-gray-600 dark:text-gray-400 mt-4">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            Register
          </a>
        </p>
      </motion.form>
    </div>
  );
};

export default Login;