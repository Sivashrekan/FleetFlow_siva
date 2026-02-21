import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";
import { motion } from "framer-motion";
import toast from "react-hot-toast"; 

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "dispatcher",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      setLoading(true);
      await API.post("/auth/register", form);
      toast.success("Account created 🚀");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.error || "Register failed");
    } finally {
      setLoading(false);
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
      {/* Logo */}
      <h1 className="text-center text-blue-600 font-bold text-xl mb-1">
        FleetFlow
      </h1>

      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        Create Account 🚀
      </h2>

      {/* Name */}
      <input
        name="name"
        placeholder="Full Name"
        value={form.name}
        onChange={handleChange}
        className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 outline-none p-3 w-full mb-4 rounded-lg dark:bg-gray-700 dark:text-white transition"
      />

      {/* Email */}
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 outline-none p-3 w-full mb-4 rounded-lg dark:bg-gray-700 dark:text-white transition"
      />

      {/* Password */}
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 outline-none p-3 w-full mb-4 rounded-lg dark:bg-gray-700 dark:text-white transition"
      />

      {/* Role */}
      <select
        name="role"
        value={form.role}
        onChange={handleChange}
        className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 outline-none p-3 w-full mb-5 rounded-lg dark:bg-gray-700 dark:text-white transition"
      >
        <option value="admin">Admin</option>
        <option value="dispatcher">Dispatcher</option>
        <option value="fleet_manager">Fleet Manager</option>
        <option value="safety_officer">Safety Officer</option>
        <option value="financial_analyst">Financial Analyst</option>
      </select>

      {/* Button */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleRegister}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold shadow-md transition"
      >
        {loading ? "Registering..." : "Register"}
      </motion.button>

      {/* Login link */}
      <p className="mt-5 text-center text-gray-600 dark:text-gray-300">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-blue-500 hover:underline font-medium"
        >
          Login
        </Link>
      </p>
    </motion.div>
  </div>
);
}