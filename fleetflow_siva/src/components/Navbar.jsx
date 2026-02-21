import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Navbar() {
  const [dark, setDark] = useState(false);
  const navigate = useNavigate();
  const logout = () => {
  localStorage.clear();
  navigate("/login");
};
  return (
  <div className="flex items-center justify-between px-6 py-3 bg-white dark:bg-gray-800 shadow">
    
    {/* LEFT TITLE */}
    <h2 className="font-semibold text-lg dark:text-white">
      Fleet Management
    </h2>

    {/* RIGHT BUTTONS */}
    <div className="flex items-center gap-3">
      <button
        onClick={() => {
          setDark(!dark);
          document.documentElement.classList.toggle("dark");
        }}
        className="bg-blue-600 text-white px-3 py-1 rounded"
      >
        Toggle
      </button>

      <button
        onClick={logout}
        className="bg-red-600 text-white px-3 py-1 rounded"
      >
        Logout
      </button>
    </div>

  </div>
);
}