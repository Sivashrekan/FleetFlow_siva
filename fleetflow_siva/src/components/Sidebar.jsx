import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

export default function Sidebar() {

  const role = localStorage.getItem("role");
  const allMenus = [
  { name: "Dashboard", path: "/", roles: ["fleet_manager", "dispatcher", "safety_officer", "financial_analyst","admin"] },

  { name: "Vehicles", path: "/vehicles", roles: ["fleet_manager", "dispatcher","admin"] },

  { name: "Drivers", path: "/drivers", roles: ["fleet_manager", "safety_officer","admin"] },

  { name: "Trips", path: "/trips", roles: ["fleet_manager", "dispatcher","admin"] },

  { name: "Maintenance", path: "/maintenance", roles: ["fleet_manager", "financial_analyst","admin"] },
];
const menu = allMenus.filter((m) => m.roles.includes(role));
  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-60 h-screen bg-white dark:bg-gray-800 shadow-lg fixed"
    >
      <h1 className="text-xl font-bold p-4 text-blue-600">
        FleetFlow
      </h1>

      <nav className="flex flex-col gap-2 p-3">
        {menu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `p-2 rounded transition text-gray-800 dark:text-white ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-200 dark:hover:bg-gray-700"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </motion.div>
  );
}