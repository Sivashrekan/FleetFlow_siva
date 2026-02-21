import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

export default function Sidebar() {

  // 🔥 get user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  // 🔥 prevent blank UI
  if (!role) return null;

  // 🔥 role based menu
  const allMenus = [
    {
      name: "Dashboard",
      path: "/",
      roles: ["admin", "fleet_manager", "dispatcher", "safety_officer", "financial_analyst"],
    },
    {
      name: "Vehicles",
      path: "/vehicles",
      roles: ["admin", "fleet_manager"],
    },
    {
      name: "Drivers",
      path: "/drivers",
      roles: ["admin", "fleet_manager", "safety_officer"],
    },
    {
      name: "Trips",
      path: "/trips",
      roles: ["admin", "dispatcher"],
    },
    {
      name: "Maintenance",
      path: "/maintenance",
      roles: ["admin", "financial_analyst"],
    },
  ];

  const menu = allMenus.filter((m) => m.roles.includes(role));

  return (
    <motion.div
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="w-64 h-screen bg-white dark:bg-gray-900 shadow-xl fixed left-0 top-0 border-r border-gray-200 dark:border-gray-700"
    >
      {/* Logo */}
      <h1 className="text-2xl font-bold p-5 text-blue-600 tracking-wide">
        FleetFlow
      </h1>

      {/* Role Badge */}
      <div className="px-5 mb-3">
        <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
          {role.toUpperCase()}
        </span>
      </div>

      {/* Menu */}
      <nav className="flex flex-col gap-2 px-3">
        {menu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg font-medium transition-all duration-200
              ${
                isActive
                  ? "bg-blue-600 text-white shadow"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800"
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