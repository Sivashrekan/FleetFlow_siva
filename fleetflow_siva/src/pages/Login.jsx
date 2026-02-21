import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async () => {
  try {
    const res = await API.post("/auth/login", form);

    localStorage.setItem("user", JSON.stringify(res.data.user));

    alert("Welcome back 🔥");

    navigate("/");   // 🔥 THIS MUST BE HERE
  } catch {
    alert("Invalid credentials");
  }
};
  return (
  <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">

    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-2xl w-96 border border-gray-200 dark:border-gray-700"
    >
      <h2 className="mb-6 text-2xl font-bold text-center text-gray-800 dark:text-white">
        Welcome Back 👋
      </h2>

      {/* Email */}
      <input
        name="email"
        placeholder="Email"
        onChange={handleChange}
        className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 outline-none p-3 w-full mb-4 rounded-lg dark:bg-gray-700 dark:text-white transition"
      />

      {/* Password */}
      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
        className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 outline-none p-3 w-full mb-5 rounded-lg dark:bg-gray-700 dark:text-white transition"
      />

      {/* Button */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleLogin}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold shadow-md transition"
      >
        Login
      </motion.button>

      {/* Links */}
      <p className="mt-5 text-center text-gray-600 dark:text-gray-300">
        Don’t have an account?{" "}
        <Link
          to="/register"
          className="text-blue-500 hover:underline font-medium"
        >
          Register
        </Link>
      </p>

      <p className="text-center mt-2">
        <Link
          to="/forgot"
          className="text-sm text-gray-500 hover:text-blue-500"
        >
          Forgot password?
        </Link>
      </p>
    </motion.div>
  </div>
);
}