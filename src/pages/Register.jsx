import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { updateProfile } from "firebase/auth";

const Register = () => {
  const { register, loginWithGoogle } = useAuth(); // ✅ destructuring corrected
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const photo = e.target.photo.value;

    try {
      const res = await register(email, password); // ✅ Firebase email/password register
      console.log("Registered user:", res.user);

      // ✅ update profile correctly
      await updateProfile(res.user, {
        displayName: name,
        photoURL: photo || "",
      });

      navigate("/"); // ✅ Registration successful হলে হোমে navigate
    } catch (err) {
      console.error("Registration error:", err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const res = await loginWithGoogle();
      console.log("Google user:", res.user);
      navigate("/"); // Successful login হলে হোমে redirect
    } catch (err) {
      console.error("Google login error:", err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <form onSubmit={handleRegister} className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md space-y-4">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Create Your Account
        </h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          required
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          required
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          name="photo"
          placeholder="Photo URL (optional)"
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          type="submit"
          className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all font-semibold"
        >
          Register
        </button>

        <p className="text-gray-400 text-center py-2">OR CONTINUE WITH</p>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex items-center justify-center w-full py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-all gap-2"
        >
          Login with Google
        </button>

        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline font-medium">
            Sign In
          </a>
        </p>
      </form>
    </div>
  );
};

export default Register;
