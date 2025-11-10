import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";
import Loader from "../components/Loader";

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
      const res = await login(email, password);
      console.log(res.user);
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err.message);
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const res = await loginWithGoogle();
      console.log("Google user:", res.user);
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err.message);
    }
    setLoading(false);
  };

  return (
    <>
      {loading && <Loader />}
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
        <form
          onSubmit={handleSignin}
          className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md space-y-4"
        >
          <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
            Sign In
          </h2>

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

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Signing In..." : "Login"}
          </button>

          <p className="text-gray-400 text-center py-2">OR CONTINUE WITH</p>

          <button
            onClick={handleGoogleLogin}
            type="button"
            className="flex items-center justify-center w-full py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-all gap-2"
            disabled={loading}
          >
            Login with Google
          </button>

          <p className="text-center text-gray-600 mt-4">
            Don't have an account?{" "}
            <a
              href="/register"
              className="text-blue-600 hover:underline font-medium"
            >
              Register
            </a>
          </p>
        </form>
      </div>
    </>
  );
};

export default Login;
