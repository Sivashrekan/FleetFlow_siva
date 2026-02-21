import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../api";

export default function Forgot() {
  const [email, setEmail] = useState("");

  const handleForgot = async () => {
    try {
      // demo hackathon version
      await API.post("/auth/forgot", { email });

      toast.success("Reset link sent to your email 🚀");
    } catch {
      toast.error("Email not found");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-2xl w-96"
      >
        <h1 className="text-center text-blue-600 font-bold text-xl mb-2">
          FleetFlow
        </h1>

        <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">
          Forgot Password 🔑
        </h2>

        <input
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 focus:ring-2 focus:ring-blue-400 p-3 w-full mb-4 rounded-lg dark:bg-gray-700 dark:text-white"
        />

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleForgot}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
        >
          Send Reset Link
        </motion.button>

        <p className="mt-5 text-center dark:text-gray-300">
          <Link to="/login" className="text-blue-500">
            Back to Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}