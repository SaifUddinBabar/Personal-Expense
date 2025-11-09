import React from "react";
import { useAuth } from "../AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithGoogle } = useAuth();

=  const from = location.state?.from?.pathname || "/";

  const handleSignin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const res = await login(email, password);
      console.log(res.user);
      navigate(from, { replace: true }); 
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const res = await loginWithGoogle();
      console.log("Google user:", res.user);
      navigate(from, { replace: true }); // Google login successful হলে redirect
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <form onSubmit={handleSignin} className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md space-y-4">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Sign In</h2>

        <input type="email" name="email" placeholder="Email Address" required className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400" />
        <input type="password" name="password" placeholder="Password" required className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400" />

        <button type="submit" className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all font-semibold">Login</button>

        <p className="text-gray-400 text-center py-2">OR CONTINUE WITH</p>

        <button onClick={handleGoogleLogin} type="button" className="flex items-center justify-center w-full py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-all gap-2">
          <svg aria-label="Google logo" width="20" height="20" viewBox="0 0 512 512">
            <g>
              <path d="m0 0H512V512H0" fill="#fff"></path>
              <path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path>
              <path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path>
              <path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path>
              <path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path>
            </g>
          </svg>
          Login with Google
        </button>

        <p className="text-center text-gray-600 mt-4">
          Don't have an account? <a href="/register" className="text-blue-600 hover:underline font-medium">Register</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
